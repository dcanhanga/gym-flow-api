import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		environment: 'node',
		// silent: true,
		coverage: {
			all: false,
			provider: 'v8',
			reporter: ['text', 'lcov'],
		},
		include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
	},

	plugins: [tsconfigPaths()],
});
