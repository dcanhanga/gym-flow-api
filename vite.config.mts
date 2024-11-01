import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		environment: 'node',
		silent: true,
		environmentMatchGlobs: [['tests/e2e/**', 'prisma']],
		coverage: {
			all: false,
			provider: 'v8',
			reporter: ['text', 'lcov'],
		},
		include: [
			'**/__tests__/**/*.spec.ts',
			'**/*.test.ts',
			'**/*.{test,spec}.ts',
		],

		exclude: [
			'__src/**/*.spec.ts',
			'_src/**/*.test.ts',
			'__tests/**/*.spec.ts',
			'_tests/**/*.test.ts',
			'node_modules/',
		],
	},

	plugins: [tsconfigPaths()],
});
