import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterRoleUseCase } from '@/application/use-cases/role/register-role';
import { InvalidParametersError, ResourceConflictError } from '@/domain/errors';
import { ZodRoleValidator } from '@/infrastructure/validators/zod/role';
import { InMemoryRoleRepository } from '@/tests/in-memory-repository/role-repository';

const VALID_ROLES = ['CLIENT', 'ADMIN', 'MANAGER'] as const;
const INVALID_ROLES = [' ', 'admin', 1, {}];

describe('RegisterRoleUseCase - Unit Test', () => {
	type TestSetup = {
		roleRepository: InMemoryRoleRepository;
		roleValidator: ZodRoleValidator;
		sut: RegisterRoleUseCase;
	};

	function createTestSetup(): TestSetup {
		const roleRepository = new InMemoryRoleRepository();
		const roleValidator = new ZodRoleValidator();
		const sut = new RegisterRoleUseCase(roleRepository, roleValidator);

		return {
			roleRepository,
			roleValidator,
			sut,
		};
	}

	let setup: TestSetup;

	beforeEach(() => {
		setup = createTestSetup();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
	describe('Caso de erros', () => {
		it.each(INVALID_ROLES)(
			'deve lançar um erro InvalidParams quando role for invalido',
			async (role) => {
				const params = { name: role };
				await expect(
					//@ts-ignore - para testar o erro de parâmetros inválidos
					setup.sut.register({ name: params.name }),
				).rejects.toThrow(InvalidParametersError);
			},
		);
		it('deve lançar um erro ResourceAlreadyExists quando role já existe', async () => {
			const { sut } = setup;
			const params = { name: 'ADMIN' } as const;
			await sut.register(params);
			await expect(setup.sut.register(params)).rejects.toThrow(
				ResourceConflictError,
			);
		});
		it('deve lançar um erro não previsto quando ocorrer uma exceção inesperada', async () => {
			const roleRepositorySpy = vi.spyOn(setup.roleRepository, 'findByName');
			roleRepositorySpy.mockImplementation(() => {
				throw new Error();
			});

			await expect(
				setup.sut.register({ name: VALID_ROLES[0] }),
			).rejects.toThrow(Error);
		});
	});

	describe('caso de sucesso', () => {
		it.each(VALID_ROLES)(
			'should register a valid role without errors (%s)',
			async (validRole) => {
				const params = { name: validRole };
				await expect(
					setup.sut.register({ name: params.name }),
				).resolves.toBeUndefined();
			},
		);
	});
});
