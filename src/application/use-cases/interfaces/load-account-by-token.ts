import type { Account } from '@/application/entities/account';

interface LoadAccountByToken {
	load(params: LoadAccountByTokenParams): Promise<LoadAccountByTokenResult>;
}
type LoadAccountByTokenParams = { token: string };
type LoadAccountByTokenResult = Account;

export type {
	LoadAccountByToken,
	LoadAccountByTokenResult,
	LoadAccountByTokenParams,
};
