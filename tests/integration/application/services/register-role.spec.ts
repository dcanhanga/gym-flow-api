import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RegisterRoleService } from '@/application/services/register-role';
import {
	InvalidParametersError,
	ResourceConflictError,
} from '@/domain/errors/';
import { messages } from '@/domain/errors/message';
import { ZodRegisterRoleValidator } from '@/infrastructure/validators/zod/register-role-validator';
import { InMemoryRoleRepository } from '../../in-memory-repository/role-repository';

const VALID_ROLES = ['ADMIN', 'CLIENT', 'MANAGER'] as const;
const INVALID_ROLES = [' ', 'admin', 1, {}];

describe('RegisterRoleService - teste de integração', () => {
	type InitTypes = {
		roleRepository: InMemoryRoleRepository;
		registerRoleValidator: ZodRegisterRoleValidator;
		sut: RegisterRoleService;
	};
	function init(): InitTypes {
		const roleRepository = new InMemoryRoleRepository();
		const registerRoleValidator = new ZodRegisterRoleValidator();
		const sut = new RegisterRoleService(roleRepository, registerRoleValidator);
		return {
			roleRepository,
			registerRoleValidator,
			sut,
		};
	}
	let setup: InitTypes;
	beforeEach(() => {
		setup = init();
	});

	afterEach(() => {
		setup.roleRepository.clear();
	});

	describe('Casos de sucesso', () => {
		it.each(VALID_ROLES)(
			'deve registrar um novo role "%s" com sucesso',
			async (role) => {
				const params = { name: role };
				const result = await setup.sut.register(params);
				expect(result.name).toStrictEqual(role);
			},
		);
	});
	describe('Casos de erro', () => {
		it('deve lançar um erro ResourceAlreadyExists quando role já existe', async () => {
			const { sut } = setup;
			const roleAlreadyExists = new ResourceConflictError(
				messages.ROLE_ALREADY_EXISTS,
			);
			const params = { name: 'ADMIN' } as const;
			await sut.register(params);

			await expect(setup.sut.register(params)).rejects.toStrictEqual(
				roleAlreadyExists,
			);
		});
		it.each(INVALID_ROLES)(
			'deve lançar um erro InvalidParams quando role for invalido',
			async (role) => {
				const { sut } = setup;
				const invalidParams = new InvalidParametersError(
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
		it('deve lançar um erro InvalidParams quando o tiver campo não previsto', async () => {
			const { sut } = setup;
			const invalidParams = new InvalidParametersError(
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
