import type { RegisterAccountParams } from '@/application/use-cases/interfaces/register-account';

interface RegisterAccountValidator {
	validate(fields: RegisterAccountFields): RegisterAccountErrorResponse;
}

type RegisterAccountFields = RegisterAccountParams;
type RegisterAccountErrorResponse = {
	errors: {
		[key in keyof RegisterAccountFields]?: string;
	};
} | null;

export type {
	RegisterAccountValidator,
	RegisterAccountFields,
	RegisterAccountErrorResponse,
};
