import type { Controller } from '@/presentation/controllers/interfaces/controller';
import type { FastifyReply, FastifyRequest } from 'fastify';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const removeNullFields = (obj: Record<string, any>) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => value !== null),
	);
};

export const fastifyAdapterRoute = (controller: Controller) => {
	return async (req: FastifyRequest, rep: FastifyReply) => {
		const request = {
			...(req.body || {}),
			...(req.params || {}),
			...(req.query || {}),
		};

		const httpResponse = await controller.handle(request);

		// Remove campos nulos do httpResponse
		const filteredResponse = removeNullFields({
			message: httpResponse.message,
			data: httpResponse.data,
			errors: httpResponse.errors,
			meta: httpResponse.meta,
		});

		if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
			rep.status(httpResponse.statusCode).send(filteredResponse);
		} else {
			rep.status(httpResponse.statusCode).send(filteredResponse);
		}
	};
};
