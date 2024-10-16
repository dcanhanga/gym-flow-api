import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { InvalidParams } from '@/application/errors/invalid-params';
import { messages } from '@/application/errors/message';
import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';

import { RegisterRoleUseCase } from '@/application/use-cases/register-role';
import type { RegisterRoleValidator } from '@/application/validators/interfaces/register-role-validator';
import { ZodRegisterRoleValidator } from '@/infrastructure/validators/zod/register-role-validator';
import { InMemoryRoleRepository } from '../../in-memory-repository/role-repository';

const VALID_ROLES = ['ADMIN', 'USER', 'MANAGER'] as const;
const INVALID_ROLES = [' ', 'admin', 1, {}];

describe('Caso de uso: RegisterRoleUseCase - teste de integração', () => {
	let roleRepository: InMemoryRoleRepository = new InMemoryRoleRepository();
	let registerRoleValidator: RegisterRoleValidator =
		new ZodRegisterRoleValidator();
	let sut = new RegisterRoleUseCase(roleRepository, registerRoleValidator);
	beforeEach(() => {
		roleRepository = new InMemoryRoleRepository();
		registerRoleValidator = new ZodRegisterRoleValidator();
		sut = new RegisterRoleUseCase(roleRepository, registerRoleValidator);
	});
	afterEach(() => {
		roleRepository.clear();
	});

	describe('Casos de sucesso', () => {
		it.each(VALID_ROLES)(
			'deve registrar um novo role "%s" com sucesso',
			async (role) => {
				const params = { name: role };
				const result = await sut.register(params);
				expect(result.name).toStrictEqual(role);
			},
		);
	});
	describe('Casos de erro', () => {
		it('deve lançar um erro ResourceAlreadyExists quando role já existe', async () => {
			const roleAlreadyExists = new ResourceAlreadyExists(
				messages.THE_ROLE_ALREADY_EXISTS,
			);
			const params = { name: 'ADMIN' } as const;
			await sut.register(params);

			await expect(sut.register(params)).rejects.toStrictEqual(
				roleAlreadyExists,
			);
		});
		it.each(INVALID_ROLES)(
			'deve lançar um erro InvalidParams quando role for invalido',
			async (role) => {
				const invalidParams = new InvalidParams(
					messages.INVALID_INPUT_PARAMETERS,
					{
						role: messages.INVALID_INPUT_PARAMETERS,
					},
				);

				//@ts-ignore - para testar o erro de parâmetros inválidos
				await expect(sut.register({ name: role })).rejects.toStrictEqual(
					invalidParams,
				);
			},
		);
		it('deve lançar um erro InvalidParams quando o tiver campo nao previsto', async () => {
			const invalidParams = new InvalidParams(
				messages.INVALID_INPUT_PARAMETERS,
				{
					filed: messages.UNRECOGNIZED_FIELD,
				},
			);

			const params = { name: 'ADMIN', field: 'TESTe' };
			//@ts-ignore - para testar o erro de parâmetros inválidos
			await expect(sut.register(params)).rejects.toStrictEqual(invalidParams);
		});
	});
});
