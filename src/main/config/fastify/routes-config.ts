import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { FastifyInstance } from 'fastify';

const routesPath = join(__dirname, '../../routes');
export const setupRoutes = async (app: FastifyInstance): Promise<void> => {
	const files = readdirSync(routesPath);
	for (const file of files) {
		if (file.endsWith('.router.ts')) {
			const route = await import(join(routesPath, file));
			route.default(app);
		}
	}
};
