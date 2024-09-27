import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';

import { authenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const requestBodySchema = z.object({
		email: z.string().email(),
		password: z.string(),
	});
	const { email, password } = requestBodySchema.parse(request.body);

	try {
		await authenticateUseCase.execute({ email, password });
		reply.status(200).send();
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			reply.status(400).send({ error: error.message });
		}
		throw error;
	}
}
