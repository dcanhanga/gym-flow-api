import { randomUUID } from 'node:crypto';

import type {
	AccountInput,
	AccountRepository,
	NewAccountResponse,
	OptionalAccountResponse,
} from '@/application/repositories/account-repository';

class StubAccountRepository implements AccountRepository {
	async register(account: AccountInput): Promise<NewAccountResponse> {
		return {
			id: randomUUID(),
			name: account.name,
			email: account.email,
			password: account.password,
			roleId: randomUUID(),
			avatarUrl: 'any_avatar_url',
		};
	}
	async findById(_accountId: string): Promise<OptionalAccountResponse> {
		return {
			id: randomUUID(),
			name: 'any_name',
			email: 'any_email',
			password: 'any_password',
			roleId: randomUUID(),
			avatarUrl: 'any_avatar_url',
		};
	}
}

export { StubAccountRepository };
