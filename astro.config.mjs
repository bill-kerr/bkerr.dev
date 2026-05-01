import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: "https://bkerr.dev",
	prefetch: true,
	integrations: [tailwind(), alpinejs(), mdx(), sitemap({ filenameBase: "test-sitemap" })],
});
