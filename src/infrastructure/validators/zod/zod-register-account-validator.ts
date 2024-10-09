import { type ZodIssue, z } from 'zod';

import type { RegisterAccountServiceValidator } from '@/application/services/protocols/register-account-service-validator';
import {
	emailValidator,
	nameValidator,
	passwordValidator,
	roleValidator,
} from './utils';

export class ZodRegisterAccountValidator
	implements RegisterAccountServiceValidator
{
	validate(
		data: RegisterAccountServiceValidator.Fields,
	): RegisterAccountServiceValidator.ErrorResponse {
		const result = this.safeParse(data);
		if (!result.success) {
			return this.formatErrorResponse(result.error.issues);
		}
		return null;
	}

	private safeParse(data: RegisterAccountServiceValidator.Fields) {
		const registerAccountSchema = z.object({
			email: emailValidator(),
			name: nameValidator(),
			password: passwordValidator(),
			role: roleValidator(),
		});
		return registerAccountSchema.safeParse(data);
	}
	private formatErrorResponse(issues: ZodIssue[]) {
		const response: RegisterAccountServiceValidator.ErrorResponse = {
			errors: {},
		};
		for (const issue of issues) {
			response.errors[
				issue.path[0] as keyof RegisterAccountServiceValidator.Fields
			] = issue.message;
		}
		return response;
	}
}
