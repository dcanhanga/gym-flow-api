import z, { type ZodIssue } from 'zod';

import {
	formatExpectedTypeMismatch,
	messages,
} from '@/application/errors/message';
import type { ErrorResponse } from '@/application/validators/interfaces/error-response';

interface ZodValidator<T> {
	validate(): z.ZodType<T>;
}

class RoleValidator implements ZodValidator<'ADMIN' | 'MANAGER' | 'CLIENT'> {
	validate() {
		return z.enum(['ADMIN', 'MANAGER', 'CLIENT'], {
			message: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
		});
	}
}

class JWTTokenValidator implements ZodValidator<string> {
	validate() {
		return z
			.string({
				invalid_type_error: messages.TOKEN_MUST_BE_A_VALID_STRING,
				required_error: messages.THE_TOKEN_IS_QUIRED,
			})
			.refine(
				(token) => {
					const parts = token.split('.');
					return (
						parts.length === 3 && parts.every((part) => part.trim() !== '')
					);
				},
				{
					message: messages.TOKEN_MUST_BE_A_VALID_STRING,
				},
			);
	}
}

class ErrorFormatter {
	format(issues: ZodIssue[]): ErrorResponse {
		const response: ErrorResponse = {
			errors: {},
		};

		for (const issue of issues) {
			if (issue.code === 'unrecognized_keys') {
				response.errors[issue.keys[0]] = issue.message;
				continue;
			}

			if (!issue.path.length) {
				const typeRegex = /Expected (\w+), received (\w+)/;
				const match = typeRegex.exec(issue.message);

				if (match) {
					const expected = match[1];
					const received = match[2];

					response.errors.invalidType = formatExpectedTypeMismatch(
						expected,
						received,
					);
					continue;
				}
				response.errors.invalidType = 'Invalid type error format.';
				continue;
			}

			response.errors[issue.path[0]] = issue.message;
		}

		return response;
	}
}

export { RoleValidator, ErrorFormatter, JWTTokenValidator };
