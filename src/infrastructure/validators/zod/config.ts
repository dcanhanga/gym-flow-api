import type { ErrorResponse } from '@/application/errors';
import { messages } from '@/domain/errors';
import { formatExpectedTypeMismatch } from '@/domain/errors/message';
import z, { type ZodIssue } from 'zod';

// const emailValidator = z.string().email();
// const nameValidator = z.string().min(4);
const roleNameValidator = z.enum(['Admin', 'Manager', 'Client'], {
	message: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
});
const uuidValidator = z
	.string({
		invalid_type_error: messages.INVALID_ID_FORMAT,
		required_error: messages.ID_IS_REQUIRED,
	})
	.uuid({ message: messages.INVALID_ID_FORMAT });

// class JWTTokenValidator {
// 	validate() {
// 		return z
// 			.string({
// 				invalid_type_error: messages.TOKEN_MUST_BE_A_VALID_STRING,
// 				required_error: messages.TOKEN_IS_REQUIRED,
// 			})
// 			.refine(
// 				(token) => {
// 					const parts = token.split('.');
// 					return (
// 						parts.length === 3 && parts.every((part) => part.trim() !== '')
// 					);
// 				},
// 				{
// 					message: messages.TOKEN_MUST_BE_A_VALID_STRING,
// 				},
// 			);
// 	}
// }

// class ErrorFormatter {
// 	public static format(issues: ZodIssue[]) {
// 		const response: ErrorResponse = {
// 			errors: {},
// 		};

// 		for (const issue of issues) {
// 			if (issue.code === 'unrecognized_keys') {
// 				response.errors[issue.keys[0]] = issue.message;
// 				continue;
// 			}
// 			if (!issue.path.length) {
// 				const typeRegex = /Expected (\w+), received (\w+)/;
// 				const match = typeRegex.exec(issue.message);

// 				if (match) {
// 					const expected = match[1];
// 					const received = match[2];

// 					response.errors.invalidType = formatExpectedTypeMismatch(
// 						expected,
// 						received,
// 					);
// 					continue;
// 				}
// 				response.errors.invalidType = 'Invalid type error format.';
// 				continue;
// 			}

// 			response.errors[issue.path[0]] = issue.message;
// 		}

// 		return response.errors;
// 	}
// 	private static addError(
// 		response: ErrorResponse,
// 		field: string,
// 		message: string,
// 	) {
// 		response.errors[field] = message;
// 	}
// }

class ErrorFormatter {
	public static format(issues: ZodIssue[]): ErrorResponse {
		const error: ErrorResponse = {};
		for (const issue of issues) {
			if (issue.code === 'unrecognized_keys') {
				ErrorFormatter.addError(error, issue.keys[0], issue.message);
				continue;
			}
			if (!issue.path.length) {
				ErrorFormatter.handleTypeError(error, issue.message);
				continue;
			}
			ErrorFormatter.addError(error, issue.path[0], issue.message);
		}
		return error;
	}

	private static addError(
		error: ErrorResponse,
		field: string | number,
		message: string,
	) {
		error[field] = message;
	}

	private static handleTypeError(error: ErrorResponse, message: string) {
		const typeRegex = /Expected (\w+), received (\w+)/;
		const match = typeRegex.exec(message);

		if (match) {
			const [_, expected, received] = match;
			error.invalidType = ErrorFormatter.formatExpectedTypeMismatch(
				expected,
				received,
			);
			return;
		}
		error.invalidType = 'Invalid type error format.';
	}

	private static formatExpectedTypeMismatch(
		expected: string,
		received: string,
	): string {
		return formatExpectedTypeMismatch(expected, received);
	}
}

export { ErrorFormatter, roleNameValidator, uuidValidator };
