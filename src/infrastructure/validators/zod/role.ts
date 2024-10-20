import type {
	ErrorResponse,
	RoleParams,
	Validator,
} from '@/domain/entities/role/validator';
import { messages } from '@/domain/errors/message';
import z from 'zod';
import { ErrorFormatter, roleNameValidator, uuidValidator } from './utils';

class ZodRoleValidator implements Validator {
	private roleSchema: z.ZodSchema;

	constructor() {
		this.roleSchema = z
			.object({
				id: uuidValidator.optional(),
				name: roleNameValidator,
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });
	}

	validate(data: Record<string, unknown>): RoleParams | ErrorResponse {
		const result = this.safeParse(data);
		if (!result.success) {
			return ErrorFormatter.format(result.error.issues);
		}
		return result.data;
	}

	private safeParse(data: Record<string, unknown>) {
		return this.roleSchema.safeParse(data);
	}
}

const zodRoleValidator = new ZodRoleValidator();

export { zodRoleValidator };
