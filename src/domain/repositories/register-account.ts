import type { Account } from '../entities/account';

interface RegisterAccountRepository {
	register(
		account: RegisterAccountRepository.RegisterInput,
	): Promise<RegisterAccountRepository.RegisterResponse>;
	findByEmail(
		email: string,
	): Promise<RegisterAccountRepository.FindByEmailResponse>;
}

namespace RegisterAccountRepository {
	export type AssignRole = { userId: string; roleId: string };
	export type RegisterResponse = Omit<Account, 'password'>;
	export type RegisterInput = Omit<Account, 'id' | 'role' | 'avatarUrl'>;
	export type FindByEmailResponse = Account | null;
}

export { RegisterAccountRepository };
