// Panda CSS configuration for Bearcu Visual Novel
// Reference: https://panda-css.com/docs/introduction
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
	preflight: true,
	include: ['./src/**/*.{js,jsx,svelte,ts,tsx}'],
	// Files to exclude
	exclude: [],
	// The output directory for the css system
	outdir: 'styled-system',
	theme: {
		extend: {
			colors: {
				bearcu: {
					brown: '#8B4513',
					brownLight: '#A0522D',
					red: '#DC143C',
					honey: '#FFC107',
					honeyDark: '#FF9800',
					sky: '#87CEEB',
					forest: '#228B22',
				},
			},
			fontFamily: {
				sans: ['Comic Sans MS', 'Chalkboard SE', 'Arial', 'sans-serif'],
			},
			animation: {
				bounce: 'bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				shake: 'shake 0.5s ease-in-out',
				nod: 'nod 0.6s ease-in-out',
			},
			keyframes: {
				bounce: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-10px)' },
					'75%': { transform: 'translateX(10px)' },
				},
				nod: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-10deg)' },
					'75%': { transform: 'rotate(10deg)' },
				},
			},
		},
	},
})
