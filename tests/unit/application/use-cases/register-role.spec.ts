import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { randomUUID } from 'node:crypto';
import { InvalidParams } from '@/application/errors/invalid-params';
import { messages } from '@/application/errors/message';
import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import type { RoleRepository } from '@/application/repositories/role-repository';
import { RegisterRoleUseCase } from '@/application/use-cases/register-role';
import type { RegisterRoleValidator } from '@/application/validators/interfaces/register-role-validator';
import { StubRoleRepository } from '../stub/repositories/role-repository';
import { StubRegisterRoleValidator } from '../stub/validators/register-role-validator';

const VALID_ROLES = ['USER', 'ADMIN', 'SUPER'] as const;

describe('Caso de uso: RegisterRoleUseCase - teste unitário', () => {
	let roleRepository: RoleRepository;
	let registerRoleValidator: RegisterRoleValidator;
	let sut: RegisterRoleUseCase;

	function setup() {
		roleRepository = new StubRoleRepository();
		registerRoleValidator = new StubRegisterRoleValidator();
		sut = new RegisterRoleUseCase(roleRepository, registerRoleValidator);
	}

	beforeEach(setup);
	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Casos de erro', () => {
		it('deve lançar InvalidParams quando o nome do papel fornecido for inválido', async () => {
			const mockValidationResult = {
				errors: {
					role: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
				},
			};
			const roleValidatorSpy = vi.spyOn(registerRoleValidator, 'validate');
			roleValidatorSpy.mockReturnValue(
				new InvalidParams(messages.INVALID_PARAMS, mockValidationResult.errors),
			);
			// @ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
			const result = sut.register({ name: 'client' });

			expect(roleValidatorSpy).toBeCalledWith({ name: 'client' });
			expect(roleValidatorSpy).toHaveBeenCalledTimes(1);

			await expect(result).rejects.toThrow(InvalidParams);
			await expect(result).rejects.toMatchObject({
				message: messages.INVALID_PARAMS,
				errors: mockValidationResult.errors,
			});
		});

		it('deve lançar ResourceAlreadyExists quando um papel com o mesmo nome já está cadastrado', async () => {
			const mockRole = {
				id: '1',
				name: VALID_ROLES[0],
			};
			const roleRepositorySpy = vi.spyOn(roleRepository, 'findByName');

			roleRepositorySpy.mockResolvedValue(mockRole);

			const result = sut.register({ name: VALID_ROLES[0] });

			expect(roleRepositorySpy).toBeCalledWith(VALID_ROLES[0]);
			expect(roleRepositorySpy).toBeCalledTimes(1);
			expect(result).rejects.toThrow(ResourceAlreadyExists);
			expect(result).rejects.toMatchObject({
				message: messages.ROLE_ALREADY_EXISTS,
			});
		});
		it('deve lançar um erro não previsto quando ocorrer uma exceção inesperada', async () => {
			// @ts-ignore - Passando null para forçar um erro inesperado
			const roleRepositorySpy = vi.spyOn(roleRepository, 'findByName');

			roleRepositorySpy.mockImplementation(() => {
				throw new Error();
			});

			await expect(sut.register({ name: VALID_ROLES[0] })).rejects.toThrow(
				Error,
			);
		});

		it('deve lançar InvalidParams quando o nome do papel for uma string vazia', async () => {
			const roleValidatorSpy = vi.spyOn(registerRoleValidator, 'validate');
			roleValidatorSpy.mockReturnValue(
				new InvalidParams(messages.INVALID_PARAMS, {
					role: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
				}),
			);
			// @ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
			const result = sut.register({ name: '' });
			await expect(result).rejects.toThrow(InvalidParams);
		});
	});

	describe('Casos de sucesso', () => {
		it.each(VALID_ROLES)(
			'deve registrar um papel: "%s" com sucesso',
			async (role) => {
				const roleToSave = {
					id: randomUUID(),
					name: role,
				};
				const roleRepositorySpy = vi.spyOn(roleRepository, 'register');
				roleRepositorySpy.mockResolvedValue(roleToSave);

				const params = { name: role };

				const result = await sut.register(params);
				expect(roleRepositorySpy).toBeCalledWith(role);
				expect(result).toMatchObject(roleToSave);
			},
		);
	});
});
