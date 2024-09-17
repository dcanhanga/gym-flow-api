import { UserAlreadyExists } from '@/errors/user-already-exists-error';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository';
import { RegisterUseCase } from '@/use-cases/register';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const requestBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string(),
	});
	const { email, name, password } = requestBodySchema.parse(request.body);
	const registerUseCase = new RegisterUseCase(new PrismaUserRepository());
	try {
		await registerUseCase.execute({ email, name, password });
		reply.status(201).send();
	} catch (error) {
		if (error instanceof UserAlreadyExists) {
			reply.status(409).send({ error: error.message });
		}
		throw error;
	}
}
