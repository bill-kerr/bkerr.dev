const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		fontFamily: {
			sans: ["Nunito Sans", ...defaultTheme.fontFamily.sans],
			mono: ["Source Code Pro", ...defaultTheme.fontFamily.mono],
		},
		fontWeight: {
			normal: defaultTheme.fontWeight.normal,
			bold: defaultTheme.fontWeight.bold,
			black: defaultTheme.fontWeight.black,
		},
		extend: {
			textColor: {
				github: "#212121",
				linkedin: "#0077b7",
			},
			maxWidth: {
				"60ch": "60ch",
				"70ch": "70ch",
			},
			backgroundImage: {
				wave: "url(/img/wave.svg)",
			},
			boxShadow: {
				"blue-200":
					"rgb(249, 250, 251) 0px -0.125em 0px 0px inset, rgb(191, 219, 254) 0px -0.5em 0px 0px inset",
				"blue-100":
					"rgb(249, 250, 251) 0px -0.125em 0px 0px inset, rgb(219, 234, 254) 0px -0.5em 0px 0px inset",
			},
		},
		variants: {
			extend: {
				ringColor: ["group-hover", "focus-visible"],
				transitionProperty: ["group-hover"],
				transitionDuration: ["group-hover"],
			},
		},
	},
	plugins: [],
};
