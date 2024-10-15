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
	const baseUrl = 'api/ping';
	describe('GET /ping', () => {
		it('deve acessar api', async () => {
			const response = await request(app.server).get(`/${baseUrl}`);

			expect(response.status).toBe(200);
		});
	});
});
