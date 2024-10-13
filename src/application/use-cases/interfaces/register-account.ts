import type { Account } from '@/application/entities/account';

interface RegisterAccount {
	register(params: RegisterAccountParams): Promise<RegisterAccountResult>;
}

type RegisterAccountParams = {
	name: string;
	email: string;
	password: string;
	role: string;
};

type RegisterAccountResult = Omit<Account, 'password'>;

export type { RegisterAccount, RegisterAccountParams, RegisterAccountResult };
