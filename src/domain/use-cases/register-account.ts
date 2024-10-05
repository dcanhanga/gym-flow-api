import type { Account } from '../entities/account';

export interface RegisterAccountUseCase {
	register(
		params: RegisterAccountUseCase.Params,
	): Promise<RegisterAccountUseCase.Result>;
}

export namespace RegisterAccountUseCase {
	export type Params = {
		name: string;
		email: string;
		password: string;
		role: 'user' | 'admin' | 'super';
	};

	export type Result = null;
}
