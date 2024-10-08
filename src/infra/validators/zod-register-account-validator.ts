import type { RegisterAccountServiceValidator } from '@/app/services/protocols/register-account-service-validator';
import { validatorMessage } from '@/app/validator-message';

import { z } from 'zod';

const registerAccountSchema = z.object({
	email: z.string({
		required_error: validatorMessage.EMAIL_IS_REQUIRED,
		invalid_type_error: validatorMessage.EMAIL_MUST_BE_A_STRING,
	}),
	name: z.string({
		required_error: validatorMessage.NAME_IS_REQUIRED,
		invalid_type_error: validatorMessage.NAME_MUST_BE_A_STRING,
	}),
	password: z.string({
		required_error: validatorMessage.PASSWORD_IS_REQUIRED,
		invalid_type_error: validatorMessage.PASSWORD_MUST_BE_A_STRING,
	}),
	role: z
		.enum(['user', 'super', 'admin'], {
			invalid_type_error: validatorMessage.INVALID_ROLE,
			message: validatorMessage.INVALID_ROLE,
		})
		.default('user'),
});

export class ZodRegisterAccountValidator
	implements RegisterAccountServiceValidator
{
	validate(
		data: RegisterAccountServiceValidator.Fields,
	): RegisterAccountServiceValidator.ErrorResponse {
		const result = registerAccountSchema.safeParse(data);
		if (!result.success) {
			const errors: RegisterAccountServiceValidator.ErrorResponse = {
				errors: {},
			};
			for (const issue of result.error.issues) {
				errors.errors[
					issue.path[0] as keyof RegisterAccountServiceValidator.Fields
				] = issue.message;
			}
			return errors;
		}
		return null;
	}
}
