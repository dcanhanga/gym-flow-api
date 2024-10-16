import type { Account } from '../entities/account';
interface RegisterAccountRepository {
	findByAccessToken(accessToken: string): Promise<RegisterAccountInput>;
}
type NewAccountResponse = Account;
type RegisterAccountInput = Omit<Account, 'id' | 'role' | 'avatarUrl'>;
type OptionalAccountResponse = NewAccountResponse | null;
export type {
	RegisterAccountRepository,
	NewAccountResponse,
	RegisterAccountInput,
	OptionalAccountResponse,
};
