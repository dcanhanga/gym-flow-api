import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

import type { Account } from '@/domain/entities/account';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';
import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';

class RegisterAccountRepositoryStub implements RegisterAccountRepository {
	async register(account: RegisterAccountUseCase.Params): Promise<Account> {
		const { email, name, password, role } = account;
		return Promise.resolve({
			email,
			name,
			password,
			role,
			id: randomUUID(),
			avatarUrl: faker.image.avatar(),
		});
	}
	async findByEmail(email: string): Promise<Account | null> {
		const account: Account = {
			id: randomUUID(),
			email,
			name: faker.internet.userName(),
			avatarUrl: faker.image.avatar(),
			role: 'user',
		};
		return Promise.resolve(account);
	}
	assignRole(assignRole: RegisterAccountRepository.AssignRole): Promise<void> {
		const { roleId, userId } = assignRole;
		console.log(roleId, userId);
		return Promise.resolve();
	}
}

export { RegisterAccountRepositoryStub };
