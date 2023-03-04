import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.date(),
		preview: z.string(),
		previewImg: z.string(),
		tags: z.array(z.string()).optional(),
	}),
});

const projectCollection = defineCollection({
	schema: z.object({
		description: z.string(),
		title: z.string(),
		github: z.string().optional(),
		web: z.string().optional(),
		previewImg: z.string(),
		tags: z.array(z.string()),
		weight: z.number().optional().default(0),
	}),
});

export const collections = {
	blog: blogCollection,
	projects: projectCollection,
};
