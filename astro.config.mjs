import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import prefetch from "@astrojs/prefetch";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: "https://bkerr.dev",
	integrations: [tailwind(), alpinejs(), prefetch(), mdx(), sitemap()],
});
