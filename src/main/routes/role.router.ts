import { controller } from '@/main/factories/controllers/role';
import type { FastifyInstance } from 'fastify';
import { adapterMiddleware } from '../config/fastify/adapter-middleware';
import { fastifyAdapterRoute } from '../config/fastify/adapter-route';
import { authMiddleware } from '../factories/middlewares/auth';

export default async (app: FastifyInstance): Promise<void> => {
	const routes = async (app: FastifyInstance): Promise<void> => {
		app.post(
			'/',
			{ preHandler: [adapterMiddleware(authMiddleware.admin)] },
			fastifyAdapterRoute(controller.register),
		);
	};
	app.register(routes, { prefix: '/roles' });
};
