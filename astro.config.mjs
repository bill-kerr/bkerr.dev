import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import alpinejs from "@astrojs/alpinejs";

import prefetch from "@astrojs/prefetch";

import mdx from "@astrojs/mdx";

export default defineConfig({
	integrations: [tailwind(), alpinejs(), prefetch(), mdx()],
});
