import { z } from 'zod';

import type {
	RegisterRoleFields,
	RegisterRoleValidator,
} from '@/application/validators/interfaces/register-role-validator';
import { messages } from '@/domain/errors/message';

import { ErrorFormatter, RoleValidator } from './utils2';

class ZodRegisterRoleValidator implements RegisterRoleValidator {
	private registerRoleSchema: z.ZodSchema;
	private errorFormatter: ErrorFormatter;

	constructor() {
		this.registerRoleSchema = z
			.object({
				name: new RoleValidator().validate(),
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });
		this.errorFormatter = new ErrorFormatter();
	}

	validate(data: RegisterRoleFields) {
		const result = this.safeParse(data);
		if (!result.success) {
			return this.errorFormatter.format(result.error.issues);
		}
		return null;
	}

	private safeParse(data: RegisterRoleFields) {
		return this.registerRoleSchema.safeParse(data);
	}
}

export { ZodRegisterRoleValidator };
