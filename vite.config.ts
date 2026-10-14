import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig({
	test: {
		environment: 'jsdom',
		coverage: {
			provider: 'c8',
		},
	},
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Clip Systems App',
				short_name: 'Clip App',
				description: 'Clip Systems calculation App',
				theme_color: '#e11d48',
				icons: [
					{
						src: '/180.png',
						sizes: '180x180',
						type: 'image/png',
					},
					{
						src: '/1024.png',
						sizes: '1024x1024',
						type: 'image/png',
					},
				],
			},
		}),
	],
});
