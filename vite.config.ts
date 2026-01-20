import pandaCss from '@pandacss/vite-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		svelte(),
		pandaCss(),
	],
	resolve: {
		alias: {
			'$lib': path.resolve(__dirname, './src/lib'),
			'$stores': path.resolve(__dirname, './src/stores'),
			'$components': path.resolve(__dirname, './src/components'),
			'$stories': path.resolve(__dirname, './src/stories'),
		},
	},
	server: {
		port: 5173,
		open: false,
	},
})
