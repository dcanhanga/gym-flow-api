import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';

interface RegisterAccountServiceValidator {
	validate(
		fields: RegisterAccountServiceValidator.Fields,
	): RegisterAccountServiceValidator.ErrorResponse;
}

namespace RegisterAccountServiceValidator {
	export type Fields = RegisterAccountUseCase.Params;
	export type ErrorResponse = {
		errors: {
			[key in keyof Fields]?: string;
		};
	} | null;
}

export type { RegisterAccountServiceValidator };
