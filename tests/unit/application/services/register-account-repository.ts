import { randomUUID } from 'node:crypto';

import type { RegisterAccountRepository } from '@/domain/repositories/register-account';

class StubRegisterAccountRepository implements RegisterAccountRepository {
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

		const { password, ...AccountWithoutPassword } = newAccount;

		return AccountWithoutPassword;
	}
	async findByEmail(
		_email: string,
	): Promise<RegisterAccountRepository.FindByEmailResponse> {
		return null;
	}
}

export { StubRegisterAccountRepository };
