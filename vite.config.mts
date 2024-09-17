import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		coverage: {
			all: false,
			provider: 'v8',
		},
	},
	plugins: [tsconfigPaths()],
});
