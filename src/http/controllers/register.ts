import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const requestBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string(),
	});
	const { email, name, password } = requestBodySchema.parse(request.body);
	const userWithSameEmail = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	if (userWithSameEmail) {
		reply.status(409).send();
	}
	const passwordHash = await hash(password, 6);
	await prisma.user.create({
		data: {
			email,
			name,
			passwordHash,
		},
	});
	reply.status(201).send();
}
