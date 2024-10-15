import { messages } from '@/application/errors/message';

import type {
	RegisterAccountErrorResponse,
	RegisterAccountFields,
	RegisterAccountValidator,
} from '@/application/validators/interfaces/register-account-validator';

import { z } from 'zod';
import {
	EmailValidator,
	ErrorFormatter,
	PasswordValidator,
	RoleValidator,
} from './utils';

class ZodRegisterAccountValidator implements RegisterAccountValidator {
	private registerAccountSchema: z.ZodSchema;
	private errorFormatter: ErrorFormatter;

	constructor() {
		this.registerAccountSchema = z
			.object({
				email: new EmailValidator().validate(),
				name: new EmailValidator().validate(),
				password: new PasswordValidator().validate(),
				role: new RoleValidator().validate(),
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });
		this.errorFormatter = new ErrorFormatter();
	}

	public validate(data: RegisterAccountFields): RegisterAccountErrorResponse {
		const result = this.safeParse(data);
		if (!result.success) {
			return this.errorFormatter.format(result.error.issues);
		}
		return null;
	}

	private safeParse(data: RegisterAccountFields) {
		return this.registerAccountSchema.safeParse(data);
	}
}

export { ZodRegisterAccountValidator };
