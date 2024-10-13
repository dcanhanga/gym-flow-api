import { z } from 'zod';

import { messages } from '@/application/errors/message';

import type {
	RegisterAccountErrorResponse,
	RegisterAccountFields,
	RegisterAccountValidator,
} from '@/application/validators/interfaces/register-account-validator';
import {
	emailValidator,
	formatErrorResponse,
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
			return formatErrorResponse(result.error.issues);
		}
		return null;
	}

	private safeParse(data: RegisterAccountFields) {
		const registerAccountSchema = z
			.object({
				email: emailValidator(),
				name: nameValidator(),
				password: passwordValidator(),
				role: roleValidator(),
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });

		return registerAccountSchema.safeParse(data);
	}
}
