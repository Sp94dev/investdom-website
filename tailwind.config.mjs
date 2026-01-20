/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				navy: {
					900: '#1A365D',  // główny kolor marki INVESTDOM
					800: '#234876',
					700: '#2C5A8F',
				},
				stone: {
					50: '#FAFAF9',
					100: '#F5F5F4',
				},
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Montserrat', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
