import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async (app: FastifyInstance): Promise<void> => {
	app.get('/ping', async (_req: FastifyRequest, rep: FastifyReply) => {
		rep.status(200).send({ message: 'Welcome to the API Gym Flow!' });
	});
};
