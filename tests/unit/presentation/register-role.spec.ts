import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InvalidParams } from '@/application/errors/invalid-params';
import { messages } from '@/application/errors/message';
import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import type { RegisterRole } from '@/application/use-cases/interfaces/register-role';
import { RegisterRoleController } from '@/presentation/controllers/register-role';
import { messages as controllerMessage } from '@/presentation/helpers/messages';
import { RegisterRoleUseCaseStub } from './controllers/stubs/register-role';

const VALID_ROLES = ['ADMIN', 'USER', 'MANAGER'] as const;
const HTTP_STATUS = {
	CREATED: 201,
	BAD_REQUEST: 400,
	CONFLICT: 409,
	SERVER_ERROR: 500,
};

describe('RegisterRoleController - teste unitário', () => {
	let registerRoleUseCaseStub: RegisterRole;
	let sut: RegisterRoleController;

	function setup() {
		registerRoleUseCaseStub = new RegisterRoleUseCaseStub();
		sut = new RegisterRoleController(registerRoleUseCaseStub);
	}

	beforeEach(setup);

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Caso de Sucessos', () => {
		it.each(VALID_ROLES)(
			'deve retornar 201 quando role for "%s"',
			async (role) => {
				const response = await sut.handle({ name: role });
				expect(response.statusCode).toStrictEqual(HTTP_STATUS.CREATED);
				expect(response.message).toStrictEqual(
					controllerMessage.ROLE_CREATED_SUCCESS,
				);
			},
		);
	});

	describe('Caso de erros', () => {
		it('deve retornar 400 quando o role for inválido', async () => {
			const invalidParams = new InvalidParams(
				messages.INVALID_INPUT_PARAMETERS,
				{
					role: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
				},
			);
			const registerRoleUseCaseSpy = vi.spyOn(
				registerRoleUseCaseStub,
				'register',
			);
			registerRoleUseCaseSpy.mockRejectedValue(invalidParams);

			// @ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
			const response = await sut.handle('INVALID');

			expect(registerRoleUseCaseSpy).toBeCalledWith('INVALID');
			expect(registerRoleUseCaseSpy).toBeCalledTimes(1);
			expect(response.statusCode).toStrictEqual(HTTP_STATUS.BAD_REQUEST);
			expect(response.message).toStrictEqual(messages.INVALID_INPUT_PARAMETERS);
			expect(response.errors).toStrictEqual({
				role: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
			});
		});

		it('deve retornar 409 quando o role já existir', async () => {
			const resourceAlreadyExists = new ResourceAlreadyExists(
				messages.THE_ROLE_ALREADY_EXISTS,
			);
			const registerRoleUseCaseSpy = vi.spyOn(
				registerRoleUseCaseStub,
				'register',
			);
			registerRoleUseCaseSpy.mockRejectedValue(resourceAlreadyExists);

			const response = await sut.handle({ name: 'ADMIN' });

			expect(registerRoleUseCaseSpy).toBeCalledWith({ name: 'ADMIN' });
			expect(registerRoleUseCaseSpy).toBeCalledTimes(1);
			expect(response.statusCode).toStrictEqual(HTTP_STATUS.CONFLICT);
			expect(response.message).toStrictEqual(messages.THE_ROLE_ALREADY_EXISTS);
		});
		it('deve retornar 500 quando um erro inesperado acontecer', async () => {
			const registerRoleUseCaseSpy = vi.spyOn(
				registerRoleUseCaseStub,
				'register',
			);
			registerRoleUseCaseSpy.mockRejectedValue(new Error());
			const response = await sut.handle({ name: 'ADMIN' });

			expect(registerRoleUseCaseSpy).toBeCalledWith({ name: 'ADMIN' });
			expect(registerRoleUseCaseSpy).toBeCalledTimes(1);
			expect(response.statusCode).toStrictEqual(HTTP_STATUS.SERVER_ERROR);
			expect(response.message).toStrictEqual(messages.INTERNAL_SERVER_ERROR);
		});
	});
});
