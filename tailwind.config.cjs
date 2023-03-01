const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
      mono: ['Source Code Pro', ...defaultTheme.fontFamily.mono],
    },
    fontWeight: {
      normal: defaultTheme.fontWeight.normal,
      bold: defaultTheme.fontWeight.bold,
      black: defaultTheme.fontWeight.black,
    },
    extend: {
      textColor: {
        github: '#212121',
        linkedin: '#0077b7',
      },
      backgroundImage: {
        wave: 'url(/img/wave.svg)',
      },
    },
  },
  plugins: [],
};
