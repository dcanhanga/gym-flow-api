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
		include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
		exclude: ['_src/**/*.spec.ts', '_src/**/*.test.ts'],
	},

	plugins: [tsconfigPaths()],
});
