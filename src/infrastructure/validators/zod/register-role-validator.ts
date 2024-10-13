import { z } from 'zod';

import { messages } from '@/application/errors/message';
import type { ErrorResponse } from '@/application/validators/interfaces/error-response';
import type {
	RegisterRoleFields,
	RegisterRoleValidator,
} from '@/application/validators/interfaces/register-role-validator';
import { formatErrorResponse, roleValidator } from './utils';

class ZodRegisterRoleValidator implements RegisterRoleValidator {
	validate(data: RegisterRoleFields): ErrorResponse {
		const result = this.safeParse(data);
		if (!result.success) {
			return formatErrorResponse(result.error.issues);
		}
		return null;
	}

	private safeParse(data: RegisterRoleFields) {
		const registerAccountSchema = z
			.object({
				name: roleValidator(),
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });

		return registerAccountSchema.safeParse(data);
	}
}
export { ZodRegisterRoleValidator };
