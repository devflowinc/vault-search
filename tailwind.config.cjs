/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'shark': {
					DEFAULT: '#202124',
					50: '#767A85',
					100: '#6D707A',
					200: '#5A5C65',
					300: '#46494F',
					400: '#33353A',
					500: '#202124',
					600: '#1B1C1F',
					700: '#161719',
					800: '#121214',
					900: '#0D0D0E',
					950: '#0A0B0C'
				},
			},
		},
	},
	plugins: [],
}
