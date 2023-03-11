type FavoriteThing = Readonly<{
	title: string;
	description: string;
	url: string;
}>;

type FavoriteCategory = Readonly<{
	category: string;
	name: string;
	bgClass: string;
	textClass: string;
	linkClass: string;
	things: Readonly<FavoriteThing[]>;
}>;

export const favoriteThings = [
	{
		category: "technologies",
		name: "Technologies",
		bgClass: "bg-blue-500",
		textClass: "text-blue-600",
		linkClass: "text-blue-900 border-blue-500 bg-blue-100 hover:bg-blue-200",
		things: [
			{
				title: "TailwindCSS",
				description:
					"My favorite CSS tool. Encourages consistent design, has total flexibility, and no more inventing painful CSS class names.",
				url: "https://tailwindcss.com",
			},
			{
				title: "TypeScript",
				description:
					"It's hard to imagine writing an application in plain JavaScript after using TypeScript.",
				url: "https://www.typescriptlang.org",
			},
			{
				title: "Svelte",
				description: "Exciting frontend framework that doesn't use a virtual DOM.",
				url: "https://svelte.dev",
			},
			{
				title: "Netlify",
				description: "Web hosting platform that provides a fantastic user experience.",
				url: "https://netlify.com",
			},
			{
				title: "Astro",
				description: "Static site builder that allows you to bring your own JS framework.",
				url: "https://astro.build",
			},
			{
				title: "Zod",
				description: "The best JavaScript validation library out there.",
				url: "https://zod.dev/",
			},
		],
	},
	{
		category: "developers",
		name: "Developers",
		bgClass: "bg-yellow-500",
		textClass: "text-yellow-700",
		linkClass: "text-yellow-900 border-yellow-500 bg-yellow-100 hover:bg-yellow-200",
		things: [
			{
				title: "Colin McDonnell",
				description: "Creator of Zod and terrific open source contributor for TypeScript.",
				url: "https://github.com/colinhacks",
			},
			{
				title: "Adam Wathan",
				description:
					"Well-known in the Laravel community, but recently created TailwindCSS. Produces A+ quality content.",
				url: "https://twitter.com/adamwathan",
			},
			{
				title: "Rich Harris",
				description: "Creator of Svelte. Has unique and big ideas.",
				url: "https://twitter.com/Rich_Harris",
			},
		],
	},
	{
		category: "cooking",
		name: "Cooking",
		bgClass: "bg-red-500",
		textClass: "text-red-600",
		linkClass: "text-red-900 border-red-500 bg-red-100 hover:bg-red-200",
		things: [
			{
				title: "America's Test Kitchen",
				description:
					"My source of truth for all things cooking. Amazingly consistent and terrific results.",
				url: "https://twitter.com/testkitchen",
			},
			{
				title: "J. Kenji Lopez-Alt",
				description: "Fantastic chef with a facts-based approach to cooking.",
				url: "https://twitter.com/kenjilopezalt",
			},
		],
	},
	{
		category: "podcasts",
		name: "Podcasts",
		bgClass: "bg-green-500",
		textClass: "text-green-700",
		linkClass: "text-green-900 border-green-500 bg-green-100 hover:bg-green-200",
		things: [
			{
				title: "EconTalk",
				description:
					"Running every week since 2006 and touching on much more than just economics, EconTalk is one of the best podcasts for learning something new.",
				url: "https://www.econtalk.org/",
			},
			{
				title: "Frontend First",
				description:
					"A podcast about modern web development. A great place to learn what the latest web tech is.",
				url: "https://www.frontendfirst.fm/",
			},
			{
				title: "Lexicon Valley",
				description: "A linguistics podcast hosted by John McWhorter of Columbia University.",
				url: "https://lexiconvalley.substack.com/",
			},
		],
	},
] as const satisfies Readonly<FavoriteCategory[]>;
