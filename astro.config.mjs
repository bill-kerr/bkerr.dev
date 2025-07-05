import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import alpinejs from "@astrojs/alpinejs";

import prefetch from "@astrojs/prefetch";

import mdx from "@astrojs/mdx";

export default defineConfig({
	integrations: [tailwind(), alpinejs(), prefetch(), mdx()],
	image: {
		remotePatterns: [{ protocol: "https" }],
		service: {
			entrypoint: "astro/assets/services/sharp",
		},
	},
	build: {
		inlineStylesheets: "auto",
		assets: "assets",
	},
	vite: {
		build: {
			cssMinify: true,
			rollupOptions: {
				output: {
					manualChunks: {
						// Separate vendor chunks for better caching
						alpine: ["alpinejs"],
					},
				},
			},
		},
		ssr: {
			noExternal: ["sharp"],
		},
	},
	compressHTML: true,
});
