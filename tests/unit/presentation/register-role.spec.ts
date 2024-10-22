import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RegisterRole } from '@/application/use-cases/role/protocols/register';
import { InvalidParametersError, ResourceConflictError } from '@/domain/errors';
import { messages } from '@/domain/errors/message';
import { RegisterRoleController } from '@/presentation/controllers/register-role';
import { messages as controllerMessage } from '@/presentation/helpers/messages';
import { StubRegisterRoleUseCase } from './controllers/stubs/register-role';

const VALID_ROLES = ['ADMIN', 'CLIENT', 'MANAGER'] as const;

describe('RegisterRoleController - teste unitário', () => {
	let registerRoleUseCaseStub: RegisterRole;
	let sut: RegisterRoleController;

	function setup() {
		registerRoleUseCaseStub = new StubRegisterRoleUseCase();
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
				expect(response.statusCode).toStrictEqual(201);
				expect(response.message).toStrictEqual(
					controllerMessage.ROLE_CREATED_SUCCESS,
				);
			},
		);
	});

	describe('Caso de erros', () => {
		it('deve retornar 400 quando o role for inválido', async () => {
			const invalidParams = new InvalidParametersError(
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
			expect(response.statusCode).toStrictEqual(400);
			expect(response.message).toStrictEqual(messages.INVALID_INPUT_PARAMETERS);
			expect(response.errors).toStrictEqual({
				role: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
			});
		});

		it('deve retornar 409 quando o role já existir', async () => {
			const resourceAlreadyExists = new ResourceConflictError(
				messages.ROLE_ALREADY_EXISTS,
			);
			const registerRoleUseCaseSpy = vi.spyOn(
				registerRoleUseCaseStub,
				'register',
			);
			registerRoleUseCaseSpy.mockRejectedValue(resourceAlreadyExists);

			const response = await sut.handle({ name: 'ADMIN' });

			expect(registerRoleUseCaseSpy).toBeCalledWith({ name: 'ADMIN' });
			expect(registerRoleUseCaseSpy).toBeCalledTimes(1);
			expect(response.statusCode).toStrictEqual(409);
			expect(response.message).toStrictEqual(messages.ROLE_ALREADY_EXISTS);
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
			expect(response.statusCode).toStrictEqual(500);
			expect(response.message).toStrictEqual(messages.INTERNAL_SERVER_ERROR);
		});
	});
});
