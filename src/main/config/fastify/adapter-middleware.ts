import type { Middleware } from '@/presentation/middlewares/interfaces/middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const adapterMiddleware = (middleware: Middleware) => {
	return async (req: FastifyRequest, reply: FastifyReply) => {
		const accessToken =
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			req.headers['x-access-token'] || req.cookies['accessToken'];
		const request = {
			accessToken: accessToken,
			...(req.headers || {}),
		};

		const httpResponse = await middleware.handle(request);

		if (httpResponse.statusCode === 200) {
			Object.assign(req, httpResponse.body);
			return;
		}
		reply.status(httpResponse.statusCode).send({
			message: httpResponse.message,
		});
	};
};
