import type {
	NewParams,
	Params,
	Validator,
} from '@/domain/entities/account/protocols';
import { InvalidParametersError, messages } from '@/domain/errors';
import z from 'zod';
import {
	ErrorFormatter,
	emailValidator,
	nameValidator,
	passwordValidator,
	roleNameValidator,
	uuidValidator,
} from './utils';

class ZodAccountValidator implements Validator {
	private parseCreate(params: Record<string, unknown>) {
		return z
			.object({
				email: emailValidator,
				name: nameValidator,
				password: passwordValidator,
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD })
			.safeParse(params);
	}
	roleId(roleId: string): string {
		const result = z.string().uuid().safeParse(roleId);
		if (!result.success) {
			throw new Error('ID provided by database is invalid uuid');
		}
		return result.data;
	}

	private roleSchemaUpdate() {
		return z
			.object({
				name: roleNameValidator,
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });
	}

	create(params: Record<string, unknown>) {
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
	// update(params: Record<string, unknown>) {
	// 	const result = this.roleSchemaUpdate().safeParse(params);
	// 	if (!result.success) {
	// 		const errors = ErrorFormatter.format(result.error.issues);
	// 		throw new InvalidParametersError(
	// 			messages.INVALID_INPUT_PARAMETERS,
	// 			errors,
	// 		);
	// 	}
	// 	return result.data;
	// }
}

export { ZodAccountValidator };
