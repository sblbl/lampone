/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				work: ["'Work Sans'", 'serif'],
				fruktur: ["'Fruktur'", 'serif']
			},
			colors: {
				'light-cream': '#FFF1DB',
				'dark-cream': '#D4BDAC',
				'blue-raspberry': '#223463',
				raspberry: '#EF5A6F',
				'raspberry-light': '#f37889',
				'neutral-light': '#FFFFFF',
				'neutral-dark': '#000000'
			}
		}
	},
	plugins: []
}
