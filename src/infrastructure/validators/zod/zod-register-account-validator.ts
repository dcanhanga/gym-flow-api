import { type ZodIssue, z } from 'zod';

import type {
	RegisterAccountErrorResponse,
	RegisterAccountFields,
	RegisterAccountValidator,
} from '@/application/services/interfaces/register-account-validator';
import {
	emailValidator,
	nameValidator,
	passwordValidator,
	roleValidator,
} from './utils';

export class ZodRegisterAccountValidatorService
	implements RegisterAccountValidator
{
	validate(data: RegisterAccountFields): RegisterAccountErrorResponse {
		const result = this.safeParse(data);
		if (!result.success) {
			return this.formatErrorResponse(result.error.issues);
		}
		return null;
	}

	private safeParse(data: RegisterAccountFields) {
		const registerAccountSchema = z.object({
			email: emailValidator(),
			name: nameValidator(),
			password: passwordValidator(),
			role: roleValidator(),
		});
		return registerAccountSchema.safeParse(data);
	}
	private formatErrorResponse(issues: ZodIssue[]) {
		const response: RegisterAccountErrorResponse = {
			errors: {},
		};
		for (const issue of issues) {
			response.errors[issue.path[0] as keyof RegisterAccountFields] =
				issue.message;
		}
		return response;
	}
}
