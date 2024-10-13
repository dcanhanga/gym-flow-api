import { controller } from '@/main/factories/controllers/role';
import type { FastifyInstance } from 'fastify';
import { fastifyAdapterRoute } from '../fastify-adapter-route';

export default async (app: FastifyInstance): Promise<void> => {
	const routes = async (app: FastifyInstance): Promise<void> => {
		app.post('/', fastifyAdapterRoute(controller.register));
	};
	app.register(routes, { prefix: '/roles' });
};
