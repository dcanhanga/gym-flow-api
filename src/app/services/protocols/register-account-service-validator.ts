import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';

type Fields = RegisterAccountUseCase.Params;
export interface RegisterAccountServiceValidator {
	validate(data: Fields): ErrorResponse | null;
}

export type ErrorResponse = {
	errors: {
		[key in keyof Fields]?: string;
	};
};
