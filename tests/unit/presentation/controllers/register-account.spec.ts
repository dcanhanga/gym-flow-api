import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InvalidParams } from '@/application/errors/invalid-params';
import { errorMessage } from '@/application/message/error-message';

import { RegisterAccountController } from '@/presentation/controllers/register-account';

import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import type { RegisterAccount } from '@/application/use-cases/interfaces/register-account';
import { StubRegisterAccountService } from './../stub/register-account';

describe('Register account controller', () => {
	let sut: RegisterAccountController;
	let registerAccountService: RegisterAccount;
	beforeEach(() => {
		registerAccountService = new StubRegisterAccountService();
		sut = new RegisterAccountController(registerAccountService);
	});
	describe('Caso de erro', () => {
		it('deve retornar bad request quando os dados de entrada estiverem inválidos', async () => {
			vi.spyOn(registerAccountService, 'register').mockRejectedValueOnce(
				new InvalidParams(errorMessage.INVALID_PARAMS, {
					email: errorMessage.INVALID_EMAIL,
					name: errorMessage.EMAIL_MUST_BE_A_STRING,
					password: errorMessage.PASSWORD_IS_REQUIRED,
					role: errorMessage.INVALID_ROLE,
				}),
			);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const request: any = {
				email: 'invalid-email',
				name: {},
				role: 'invalid-role',
			};

			const response = await sut.handle(request);

			expect(registerAccountService.register).toHaveBeenCalledWith(request);
			expect(response.statusCode).toStrictEqual(400);
			expect(response.errors).toStrictEqual({
				email: errorMessage.INVALID_EMAIL,
				name: errorMessage.EMAIL_MUST_BE_A_STRING,
				password: errorMessage.PASSWORD_IS_REQUIRED,
				role: errorMessage.INVALID_ROLE,
			});
		});
		it('deve retornar conflict se account email cadastrado existir', async () => {
			vi.spyOn(registerAccountService, 'register').mockRejectedValueOnce(
				new ResourceAlreadyExists(errorMessage.EMAIL_ALREADY_EXISTS),
			);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const request: any = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'user',
			};

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(409);
			expect(response.message).toStrictEqual(errorMessage.EMAIL_ALREADY_EXISTS);
		});
	});
});
