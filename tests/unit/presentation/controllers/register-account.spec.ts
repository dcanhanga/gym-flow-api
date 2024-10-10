import { beforeEach, describe, expect, it, vi } from 'vitest';

import { afterEach } from 'node:test';
import { InvalidParams } from '@/application/errors/invalid-params';
import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import { ResourceNotFound } from '@/application/errors/resource-not-found';
import { errorMessage } from '@/application/message/error-message';
import type { RegisterAccount } from '@/application/use-cases/interfaces/register-account';
import { RegisterAccountController } from '@/presentation/controllers/register-account';

import { StubRegisterAccountService } from './../stub/register-account';

describe('Register account controller', () => {
	let sut: RegisterAccountController;
	let registerAccountService: RegisterAccount;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let request: any;

	beforeEach(() => {
		registerAccountService = new StubRegisterAccountService();
		sut = new RegisterAccountController(registerAccountService);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Casos de erro', () => {
		it('deve retornar 400 Bad Request quando os parâmetros fornecidos forem inválidos', async () => {
			const invalidParams = {
				email: errorMessage.INVALID_EMAIL,
				name: errorMessage.EMAIL_MUST_BE_A_STRING,
				password: errorMessage.PASSWORD_IS_REQUIRED,
				role: errorMessage.INVALID_ROLE,
			};
			vi.spyOn(registerAccountService, 'register').mockRejectedValueOnce(
				new InvalidParams(errorMessage.INVALID_PARAMS, invalidParams),
			);

			request = {
				email: 'invalid-email',
				name: {},
				role: 'invalid-role',
			};

			const response = await sut.handle(request);

			expect(registerAccountService.register).toHaveBeenCalledWith(request);
			expect(response.statusCode).toStrictEqual(400);
			expect(response.errors).toStrictEqual(invalidParams);
		});

		it('deve retornar 409 Conflict quando o e-mail informado já estiver cadastrado', async () => {
			vi.spyOn(registerAccountService, 'register').mockRejectedValueOnce(
				new ResourceAlreadyExists(errorMessage.EMAIL_ALREADY_EXISTS),
			);

			request = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'user',
			};

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(409);
			expect(response.message).toStrictEqual(errorMessage.EMAIL_ALREADY_EXISTS);
		});

		it('deve retornar 404 Not Found quando o role fornecido não existir no sistema', async () => {
			vi.spyOn(registerAccountService, 'register').mockRejectedValueOnce(
				new ResourceNotFound(errorMessage.ROLE_NOT_FOUND),
			);

			request = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'admin',
			};

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(404);
			expect(response.message).toStrictEqual(errorMessage.ROLE_NOT_FOUND);
		});

		it('deve retornar 500 Internal Server Error em caso de erro inesperado no serviço de registro', async () => {
			vi.spyOn(registerAccountService, 'register').mockRejectedValueOnce(
				new Error(),
			);

			request = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'admin',
			};

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(500);
			expect(response.message).toStrictEqual(
				errorMessage.INTERNAL_SERVER_ERROR,
			);
		});
	});

	describe('Casos de sucesso', () => {
		it('deve retornar 201 Created quando o registro da conta for bem-sucedido', async () => {
			const request = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'user',
			};
			const response = await sut.handle(request);
			expect(response.statusCode).toStrictEqual(201);
			expect(response.data).toStrictEqual(null);
		});
	});
});
