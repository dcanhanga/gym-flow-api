import { randomUUID } from 'node:crypto';

import type {
	AccountInput,
	AccountRepository,
	NewAccountResponse,
	OptionalAccountResponse,
} from '@/application/repositories/account-repository';
import type { Account } from '@/domain/entities/account';

class InMemoryAccountRepository implements AccountRepository {
	private items: Account[] = [];
	public clear() {
		this.items = [];
	}

	async findById(id: string): Promise<OptionalAccountResponse> {
		return this.items.find((item) => item.id === id) ?? null;
	}
	async register(account: AccountInput): Promise<NewAccountResponse> {
		const newAccount = {
			id: randomUUID(),
			avatarUrl: null,
			...account,
		};
		this.items.push(newAccount);
		return newAccount;
	}
}
export { InMemoryAccountRepository };
