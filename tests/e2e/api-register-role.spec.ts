import { messages } from '@/application/errors/message';
import { app } from '@/main/fastify';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('API: RegisterRole', () => {
	beforeAll(async () => {
		await app.ready();
	});
	afterAll(async () => {
		await app.close();
	});
	const baseUrl = 'api/roles';
	describe('POST /register-role', () => {
		it('deve registrar um novo role com sucesso', async () => {
			const response = await request(app.server).post(`/${baseUrl}`).send({
				name: 'USER',
			});

			expect(response.status).toBe(201);
		});
		it('deve retornar um erro 400 quando o corpo da requisição estiver inválido', async () => {
			const response = await request(app.server).post(`/${baseUrl}`).send({
				name: 'MANAGER',
			});
			expect(response.status).toBe(400);
			expect(response.body.message).toBe(messages.INVALID_PARAMS);
			expect(response.body.errors).toStrictEqual({
				name: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
			});
		});
	});
});
