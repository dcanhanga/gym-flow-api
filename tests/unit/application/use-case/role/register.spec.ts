import { randomUUID } from 'node:crypto';
import {
	type Mocked,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import {
	AccessForbiddenError,
	InvalidParametersError,
	ResourceConflictError,
} from '@/application/errors';
import { RegisterRoleUseCase } from '@/application/use-cases/register-role';
import type { AccountRepository, RoleRepository } from '@/domain/repositories';
import { ZodRegisterAccountValidator } from '@/infrastructure/validators/zod/register-account';
import {
	mockAccountRepository,
	mockRoleRepository,
} from '@/tests/vitest/mocks/repositories';

const createMockRole = (name: string) => ({
	id: randomUUID(),
	name,
});

const createMockAccount = (roleId: string) => ({
	id: randomUUID(),
	avatarUrl: null,
	email: 'example@example.com',
	name: 'John Doe',
	password: 'Password@A20',
	roleId,
});

describe('RegisterRoleUseCase - unit test', () => {
	let accountRepository: Mocked<AccountRepository>;
	let roleRepository: Mocked<RoleRepository>;
	let sut: RegisterRoleUseCase;

	beforeEach(() => {
		accountRepository = mockAccountRepository;
		roleRepository = mockRoleRepository;
		sut = new RegisterRoleUseCase(
			accountRepository,
			roleRepository,
			new ZodRegisterAccountValidator(),
		);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('Caso de sucesso', () => {
		it('deve registrar uma nova role com o nome "Client" e retorná-la', async () => {
			const role = createMockRole('Manager');
			const account = createMockAccount(role.id);

			roleRepository.findByName.mockResolvedValue(null);
			accountRepository.findWithRole.mockResolvedValue({
				...account,
				role,
			});

			const response = await sut.register({
				accountId: account.id,
				name: 'Client',
			});

			expect(response).toMatchObject({
				name: 'Client',
				id: expect.any(String),
			});
		});
	});

	describe('Caso de erro', () => {
		it('deve lançar InvalidParametersError se os dados de entrada forem inválidos', async () => {
			const invalidParams = {
				accountId: 'invalid-string',
				name: 'invalid-role-name',
			};

			await expect(sut.register(invalidParams)).rejects.toThrow(
				InvalidParametersError,
			);
		});

		it('deve lançar AccessForbiddenError quando uma account com role diferente de Manager tentar cadastrar um role', async () => {
			const nonManagerRole = createMockRole('Admin');
			const account = createMockAccount(nonManagerRole.id);

			roleRepository.findByName.mockResolvedValue(null);
			accountRepository.findWithRole.mockResolvedValue({
				...account,
				role: nonManagerRole,
			});

			const params = {
				accountId: account.id,
				name: 'Client',
			};

			await expect(sut.register(params)).rejects.toThrow(AccessForbiddenError);
		});

		it('deve lançar ResourceConflictError quando uma role com o mesmo nome já existe', async () => {
			const roleManager = createMockRole('Manager');
			const account = createMockAccount(roleManager.id);
			const existingRole = createMockRole('Client');

			roleRepository.findByName.mockResolvedValue(existingRole);
			accountRepository.findWithRole.mockResolvedValue({
				...account,
				role: roleManager,
			});

			const params = {
				accountId: account.id,
				name: 'Client',
			};

			await expect(sut.register(params)).rejects.toThrow(ResourceConflictError);
		});

		it('deve lançar AccessForbiddenError se a account não existir', async () => {
			const roleManager = createMockRole('Manager');
			const account = createMockAccount(roleManager.id);
			roleRepository.findByName.mockResolvedValue(roleManager);
			accountRepository.findWithRole.mockResolvedValue(null);

			const params = {
				accountId: account.id,
				name: 'Client',
			};

			await expect(sut.register(params)).rejects.toThrow(AccessForbiddenError);
		});
	});
});
