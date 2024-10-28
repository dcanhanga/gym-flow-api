import type {
	AccountDto,
	AccountRegistrationDto,
	AccountWithRoleDto,
} from '../dto/account';

export interface AccountRepository {
	findById(accountId: string): Promise<AccountDto | null>;
	findByEmail(email: string): Promise<AccountDto | null>;
	findWithRole(accountId: string): Promise<AccountWithRoleDto | null>;
	register(account: AccountRegistrationDto): Promise<AccountDto>;
}
