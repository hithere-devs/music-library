import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['src/tests/**/*.test.ts'],
		coverage: {
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/'],
		},
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		globalSetup: ['./src/tests/global-setup.ts'], // Add this line
		setupFiles: ['./src/tests/setup.ts'],
		sequence: {
			hooks: 'list', // This ensures hooks run in sequence
		},
	},
});
