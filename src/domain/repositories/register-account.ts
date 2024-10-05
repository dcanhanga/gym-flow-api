import type { Account } from '../entities/account';
import type { RegisterAccountUseCase } from '../use-cases/register-account';

export interface RegisterAccountRepository {
	register(account: RegisterAccountUseCase.Params): Promise<Account>;
	findByEmail(email: string): Promise<Account | null>;
	assignRole(assignRole: RegisterAccountRepository.AssignRole): Promise<void>;
}

export namespace RegisterAccountRepository {
	export type AssignRole = { userId: string; roleId: string };
}
