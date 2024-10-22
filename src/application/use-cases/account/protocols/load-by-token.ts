import type { AccountDto } from '@/domain/dto/account';

interface LoadAccountByTokenValidator {
	validate(params: LoadAccountByTokenParams): LoadAccountByTokenParams;
}
interface LoadAccountByToken {
	load(params: LoadAccountByTokenParams): Promise<LoadAccountByTokenResult>;
}
type LoadAccountByTokenParams = { token: string };
type LoadAccountByTokenResult = AccountDto;

export type {
	LoadAccountByToken,
	LoadAccountByTokenResult,
	LoadAccountByTokenParams,
	LoadAccountByTokenValidator,
};
