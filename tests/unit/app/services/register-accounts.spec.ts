import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterAccountService } from '@/app/services/register-account';

import { ResourceAlreadyExists } from '@/domain/errors/resource-already-exists';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';
import type { RoleRepository } from '@/domain/repositories/role';
import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';

import { RegisterAccountRepositoryStub } from './stub/register-account-repository';
import { RoleRepositoryStub } from './stub/role-repository';

describe('RegisterAccountService', () => {
	let registerAccountRepository: RegisterAccountRepository;
	let roleRepository: RoleRepository;
	let sut: RegisterAccountService;

	beforeEach(() => {
		registerAccountRepository = new RegisterAccountRepositoryStub();

		roleRepository = new RoleRepositoryStub();

		sut = new RegisterAccountService(registerAccountRepository, roleRepository);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('deve lançar ResourceAlreadyExists quando um usuário com o mesmo e-mail já estiver cadastrado', async () => {
		const accountAlreadyExits = {
			id: randomUUID(),
			email: faker.internet.email(),
			name: faker.internet.userName(),
			password: faker.internet.password(),
			avatarUrl: faker.image.avatar(),
			role: 'user',
		};

		vi.spyOn(registerAccountRepository, 'findByEmail').mockResolvedValueOnce({
			...accountAlreadyExits,
		});

		const newAccount: RegisterAccountUseCase.Params = {
			email: accountAlreadyExits.email,
			name: faker.internet.userName(),
			password: faker.internet.password(),
			role: 'user',
		};

		await expect(sut.register(newAccount)).rejects.toBeInstanceOf(
			ResourceAlreadyExists,
		);
	});
});
