import type { RoleResponse, Validator } from '@/domain/entities/role';
import { InvalidParametersError, messages } from '@/domain/errors';
import z from 'zod';
import { ErrorFormatter, roleNameValidator, uuidValidator } from './utils';

class ZodRoleValidator implements Validator {
	private parseCreate(params: Record<string, unknown>) {
		return z
			.object({
				id: uuidValidator.optional(),
				name: roleNameValidator,
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD })
			.safeParse(params);
	}

	private parseUpdate(params: Record<string, unknown>) {
		return z
			.object({
				name: roleNameValidator,
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD })
			.safeParse(params);
	}

	validateCreate(params: Record<string, unknown>): RoleResponse {
		const result = this.parseCreate(params);
		if (!result.success) {
			const errors = ErrorFormatter.format(result.error.issues);
			throw new InvalidParametersError(
				messages.INVALID_INPUT_PARAMETERS,
				errors,
			);
		}
		return result.data;
	}
	validateUpdate(params: Record<string, unknown>) {
		const result = this.parseUpdate(params);
		if (!result.success) {
			const errors = ErrorFormatter.format(result.error.issues);
			throw new InvalidParametersError(
				messages.INVALID_INPUT_PARAMETERS,
				errors,
			);
		}
		return result.data;
	}
}

export { ZodRoleValidator };
