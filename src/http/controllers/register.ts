import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { registerUseCase } from '@/use-cases/factories/make-register-use-case';
import { RegisterUseCase } from '@/use-cases/register';

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const requestBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string(),
	});
	const { email, name, password } = requestBodySchema.parse(request.body);

	try {
		await registerUseCase.execute({ email, name, password });
		reply.status(201).send();
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			reply.status(409).send({ error: error.message });
		}
		throw error;
	}
}
