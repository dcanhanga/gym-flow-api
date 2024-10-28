import type { RegisterRoleValidator } from '@/application/validators/protocols/register-role';

import { InvalidParametersError } from '@/application/errors';
import { messages } from '@/domain/errors';
import z from 'zod';
import { ErrorFormatter, roleNameValidator, uuidValidator } from './config';

export class ZodRegisterAccountValidator implements RegisterRoleValidator {
	check(params: RegisterRoleValidator.Params) {
		const response = this.safeParse(params);
		if (!response.success) {
			const errors = ErrorFormatter.format(response.error.issues);
			throw new InvalidParametersError(
				messages.INVALID_INPUT_PARAMETERS,
				errors,
			);
		}
		return response.data;
	}

	private safeParse(params: RegisterRoleValidator.Params) {
		const result = this.generateSchema().safeParse(params);
		return result;
	}
	private generateSchema() {
		return z
			.object({
				accountId: uuidValidator,
				name: roleNameValidator,
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });
	}
}
