import type { AccountDto } from '../dto/account';

interface AccountRepository {
	findById(accountId: string): Promise<OptionalAccountResponse>;
	register(account: AccountInput): Promise<NewAccountResponse>;
}
type NewAccountResponse = AccountDto;
type AccountInput = Omit<AccountDto, 'id' | 'role' | 'avatarUrl'>;
type OptionalAccountResponse = AccountDto | null;
export type {
	AccountRepository,
	NewAccountResponse,
	AccountInput,
	OptionalAccountResponse,
};
