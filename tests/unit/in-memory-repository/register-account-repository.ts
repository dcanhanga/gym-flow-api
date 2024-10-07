import { randomUUID } from 'node:crypto';
import type { Account } from '@/domain/entities/account';

import type { RegisterAccountRepository } from '@/domain/repositories/register-account';

class InMemoryRegisterAccountRepository implements RegisterAccountRepository {
	private items: Account[] = [];
	public clear(): void {
		this.items = [];
	}
	async register(
		account: RegisterAccountRepository.RegisterInput,
	): Promise<RegisterAccountRepository.RegisterResponse> {
		const { email, name, password: passwordHashed, roleId } = account;
		const newAccount = {
			id: randomUUID(),
			email,
			name,
			password: passwordHashed,
			roleId,
			avatarUrl: null,
		};
		this.items.push(newAccount);
		const { password, ...AccountWithoutPassword } = newAccount;

		return AccountWithoutPassword;
	}
	async findByEmail(
		email: string,
	): Promise<RegisterAccountRepository.FindByEmailResponse> {
		const account = this.items.find((item) => item.email === email);
		if (!account) return null;
		return account;
	}
}

export { InMemoryRegisterAccountRepository };
