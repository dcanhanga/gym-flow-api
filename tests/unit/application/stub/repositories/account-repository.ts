import { randomUUID } from 'node:crypto';

import type {
	AccountRepository,
	OptionalAccountResponse,
} from '@/application/repositories/account-repository';

class StubAccountRepository implements AccountRepository {
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
