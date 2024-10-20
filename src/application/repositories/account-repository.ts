import type { Account } from '../../domain/entities/account';
interface AccountRepository {
	findById(accountId: string): Promise<OptionalAccountResponse>;
	register(account: AccountInput): Promise<NewAccountResponse>;
}
type NewAccountResponse = Account;
type AccountInput = Omit<Account, 'id' | 'role' | 'avatarUrl'>;
type OptionalAccountResponse = NewAccountResponse | null;
export type {
	AccountRepository,
	NewAccountResponse,
	AccountInput,
	OptionalAccountResponse,
};
