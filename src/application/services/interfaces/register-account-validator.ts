import type { RegisterAccountParams } from '@/application/use-cases/interfaces/register-account';
import type { ErrorResponse } from './error-response';

interface RegisterAccountValidator {
	validate(fields: RegisterAccountFields): RegisterAccountErrorResponse;
}

type RegisterAccountFields = RegisterAccountParams;
type RegisterAccountErrorResponse = ErrorResponse;

export type {
	RegisterAccountValidator,
	RegisterAccountFields,
	RegisterAccountErrorResponse,
};
