import type { AccountDto } from '@/domain/dto/account';

interface RegisterAccount {
	register(params: RegisterAccountParams): Promise<AccountDto>;
}

type RegisterAccountParams = {
	name: string;
	email: string;
	password: string;
	roleId?: string;
};

export type { RegisterAccount, RegisterAccountParams };
