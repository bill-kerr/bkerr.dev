---
date: 2021-01-08T00:00:00Z
preview: It's important to provide consistent and informative validation errors to API consumers. Here's how I do it declaratively with class-validator and class-transformer.
previewImg: /img/data-validation.webp
title: Declarative Validation for Express APIs with Class-Validator and Class-Transformer"
---

# **Declarative Validation for Express APIs with Class-Validator and Class-Transformer**

Providing your API consumers with accurate and informative validation error messages is an important part of making the user experience enjoyable and productive. I've tried a number of JavaScript validation libraries and have settled on the excellent [class-validator](https://github.com/typestack/class-validator). Using class-validator on its own is certainly possible, but its capabilities really shine when used in conjunction with [class-transformer](https://github.com/typestack/class-transformer), which transforms the plain request body into an instance of your entity model. In this blog post, I want to talk about some unique challenges I encountered while building a NodeJS/Express API and how I solved them with a combination of class-validator and class-transformer.

### Strict Validation

I wanted to provide error feedback similar to the oft-lauded [Stripe API](https://stripe.com/docs/api). My goals for validation error messages were the following:

- Separate error details for each validation error.
- The name of the property on which the error occurred should be returned in its description.
- If multiple errors occur on a single property, return them all.

With these goals in mind, I ended up with a desired error response like this:

```json
{
	"object": "error",
	"name": "Bad Request Error",
	"statusCode": 400,
	"details": [
		{
			"object": "error-detail",
			"name": "Validation Error",
			"details": "Property invalid-property should not exist."
		},
		{
			"object": "error-detail",
			"name": "Validation Error",
			"details": "Property name must contain a string."
		},
		{
			"object": "error-detail",
			"name": "Validation Error",
			"details": "Property name must be between 3 and 255 characters long."
		}
	]
}
```

As you can see, two errors occurred on the `name` property and both were returned. Additionally, the erroneous property `invalid-property` also threw an error. Now that I knew how I wanted my errors to look, how did I implement it?

### Defining Validation Schema

The power of class-validator shines in its declarative approach to validation. You define rules on your domain objects and class-validator more or less does the rest. Here's a stripped down example from my API:

```typescript
// domain/project/project.entity.ts
// The 'validation' object contains my error message generating functions.

export class Project extends ApiObject {
	object = "project";

	@IsNotEmpty({ message: validation.required("name") })
	@IsString({ message: validation.string("name") })
	@Length(3, 255, { message: validation.length("name", 3, 255) })
	name: string;

	@IsNotEmpty({ message: validation.required("projectNumber") })
	@IsString({ message: validation.string("projectNumber") })
	@Length(1, 255, { message: validation.length("projectNumber", 1, 255) })
	projectNumber: string;

	@IsOptional()
	@IsString({ groups: CREATE_UPDATE, message: validation.string("description") })
	@Length(1, 255, { message: validation.length("description", 1, 255) })
	description: string;

	@IsOptional()
	@IsString({ groups: CREATE_UPDATE, message: validation.string("client") })
	@Length(1, 255, { message: validation.length("client", 1, 255) })
	client: string;

	@IsOptional()
	@IsNotEmpty({ message: validation.required("active") })
	@IsBoolean({ message: validation.boolean("active") })
	active: boolean;
}
```

While the above schema will throw errors when the rules defined by the property decorators are violated, it has no concept of request context. Are we creating an object? Are we updating one property? The `projectNumber` property is required when creating a project, but it's certainly not required when updating one. What if we didn't want to allow the `name` to change?

To address this problem, class-validator includes the concept of "groups". Each decorator can be assigned to an array of groups, letting class-validator know to ignore the decorator if the current group is not active. So, to define these groups, I created a static `Groups` class:

```typescript
// domain/groups.ts

export class Groups {
	public static readonly READ = "read";
	public static readonly CREATE = "create";
	public static readonly UPDATE = "update";

	public static all() {
		return [this.READ, this.CREATE, this.UPDATE];
	}
}
```

Now, armed with the new `Groups` class, we can add these to the decorators to define the context under which they should be run. Our `Project` class now looks like this:

```typescript
// domain/project/project.entity.ts

@Exclude()
export class Project extends ApiObject {
	object = "project"; // this property is exposed in the parent (ApiObject) class

	@Expose({ groups: Groups.all() })
	@IsOptional({ groups: [Groups.UPDATE] })
	@IsNotEmpty({ groups: [Groups.CREATE], message: validation.required("name") })
	@IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string("name") })
	@Length(3, 255, {
		groups: [Groups.CREATE],
		message: validation.length("name", 3, 255),
	})
	name: string;

	@Expose({ groups: Groups.all() })
	@IsOptional({ groups: [Groups.UPDATE] })
	@IsNotEmpty({ groups: [Groups.CREATE], message: validation.required("projectNumber") })
	@IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string("projectNumber") })
	@Length(1, 255, {
		groups: [Groups.CREATE, Groups.UPDATE],
		message: validation.length("projectNumber", 1, 255),
	})
	projectNumber: string;

	@Expose({ groups: Groups.all() })
	@IsOptional({ groups: [Groups.CREATE, Groups.UPDATE] })
	@IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string("description") })
	@Length(1, 255, {
		groups: [Groups.CREATE, Groups.UPDATE],
		message: validation.length("description", 1, 255),
	})
	description: string;

	@Expose({ groups: Groups.all() })
	@IsOptional({ groups: [Groups.CREATE, Groups.UPDATE] })
	@IsString({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.string("client") })
	@Length(1, 255, {
		groups: [Groups.CREATE, Groups.UPDATE],
		message: validation.length("client", 1, 255),
	})
	client: string;

	@Expose({ groups: Groups.all() })
	@IsOptional({ groups: [Groups.UPDATE] })
	@IsNotEmpty({ groups: [Groups.CREATE], message: validation.required("active") })
	@IsBoolean({ groups: [Groups.CREATE, Groups.UPDATE], message: validation.boolean("active") })
	active: boolean;
}
```

Note the `@Exclude()` decorator at the top of the class definition. This decorator sets all properties to be excluded from transformation. The `@Expose()` decorators on each property expose the properties to the contexts defined by the groups passed in as parameters.

Now that we have a well-defined validation and transformation schema, how do we run the validation on incoming requests?

### Validation Middleware

We can now run validation in a middleware, and pass in the groups we want to be "active" for any particular route. Here's the definition for the middleware that validates the request body. The same pattern can be repeated for query or URL parameters.

```typescript
// middleware/validate-body.ts

export function validateBody<T>(targetClass: ClassType<T>, groups: string[] = []) {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const errors = await validate(req.body, {
			groups,
			whitelist: true,
			forbidNonWhitelisted: true,
		});
		if (errors.length > 0) {
			throw new ValidationError(errors);
		}
		req.body = plainToClass(targetClass, req.body, { groups });
		next();
	};
}
```

There is a **significant problem** with the code above. The call to `validate()` will not work because class-validator will not recognize `req.body` as an instance of the `Project` class. You might ask why we can't just do the class transformation before the validation. We can't do that because the transformation will add properties that we do not want while validating the object. Therefore, the validation must come first. In order to trick class-validator into thinking `req.body` is an instance of the `Project` class, we add the following line before the `validate()` call:

```typescript
req.body = Object.setPrototypeOf(req.body, targetClass.prototype);
```

Now the `validate()` call thinks it's evaluating an instance of the `Project` class.

Implementing this in the controller is easy: we just add the `validateBody` middleware and pass in a target class and the groups we want applied. Here's a look at the create route in the project controller:

```typescript
// domain/project/project.controller.ts
projectRouter.post("/", validateBody(Project, [Groups.CREATE]), async (req, res) => {
	const project = await createProject({ user: req.user, resource: req.body });
	return res.status(201).json(project);
});
```

There is, as you might have guessed, another problem we haven't addressed yet.

### Wrapping the Response

So far, we've successfully validated a request body, created a project in our API, and are now ready to return the new project object. However, we might not want to send back every field in our `Project` schema. What if we were creating a User object that had password information on it? Can we exclude properties in the response as well?

Thankfully, class-transformer has a `classToPlain()` method that allows us to do just this. So do we need to call `classToPlain()` in every route handler? No, we don't. Let's wrap Express' `send()` method instead.

If you're using TypeScript (which you should be!), you can extend Express' types by adding a "@types" folder. Then, under that, add an "express" folder and finally an `index.d.ts` file (@types -> express -> index.d.ts). Inside the file, add the following code:

```typescript
// @types/express/index.d.ts

declare global {
	namespace Express {
		interface Response {
			sendRes: <T>(body: T) => void;
		}
	}
}
```

Now we can attach `sendRes()` to the response object in a middleware:

```typescript
// middleware/response-wrapper.ts

export function responseWrapper(_req: Request, res: Response, next: NextFunction) {
	res.sendRes = <T>(body: T | T[], groups: string[] = [Groups.READ]) => {
		res.json(transform(body, groups));
	};
	next();
}

function transform<T>(body: T | T[], groups: string[]) {
	return Array.isArray(body)
		? {
				object: "list",
				data: body.map((item) => classToPlain(item, { groups, excludeExtraneousValues: true })),
		  }
		: classToPlain(body, { groups, excludeExtraneousValues: true });
}
```

Notice we transform the object differently if it is an array. We can add properties, pagination, etc. Now our create project route handler looks like this:

```typescript
// domain/project/project.controller.ts

router.post("/", validateBody(Project, [Groups.CREATE]), async (req, res) => {
	const project = await createProject({ user: req.user, resource: req.body });
	return res.status(201).sendRes(project);
});
```

### Conclusion

There are many ways to implement validation, but I've slowly arrived at the approach shown in this article through many iterations of different styles of validation. Perhaps the greatest advantage of this approach is that **we only need to define one entity**. No data transfer objects, no mappers, no extra entities floating around in your code. There is one source of truth for validation, transformation/serialization, and (unaddressed in this article) database interaction.

Let me know what you think! How do you approach validation in your APIs?
