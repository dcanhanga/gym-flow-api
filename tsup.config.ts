import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.test.ts'],
	tsconfig: './tsconfig.json',
	outDir: 'build',
	clean: true,
	format: ['esm'],
	target: 'es2022',
	dts: true,
	sourcemap: true,
	minify: true,
});
