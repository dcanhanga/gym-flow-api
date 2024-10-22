import z, { type ZodIssue } from 'zod';

import {
	leastOneNumber,
	leastOneSpecialCharacter,
	leastOneUppercase,
} from '@/application/utils/regex';
import {
	type ErrorResponse,
	formatExpectedTypeMismatch,
	messages,
} from '@/domain/errors';

const passwordValidator = z
	.string({
		invalid_type_error: messages.PASSWORD_MUST_BE_A_STRING,
		required_error: messages.PASSWORD_IS_REQUIRED,
	})
	.min(8, { message: messages.PASSWORD_MUST_BE_AT_LEAST_EIGHT_CHARACTERS_LONG })
	.regex(leastOneNumber, {
		message: messages.PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_NUMBER,
	})
	.regex(leastOneUppercase, {
		message: messages.PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_UPPERCASE_CHARACTER,
	})
	.regex(leastOneSpecialCharacter, {
		message: messages.PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_SPECIAL_CHARACTER,
	});

const emailValidator = z.string().email();
const nameValidator = z.string().min(4);

const roleNameValidator = z.enum(['ADMIN', 'MANAGER', 'CLIENT'], {
	message: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
});

const avatarUrlValidator = z.string().url();

const uuidValidator = z
	.string({
		invalid_type_error: messages.INVALID_ID_FORMAT,
		required_error: messages.ID_IS_REQUIRED,
	})
	.uuid({ message: messages.INVALID_ID_FORMAT });

class JWTTokenValidator {
	validate() {
		return z
			.string({
				invalid_type_error: messages.TOKEN_MUST_BE_A_VALID_STRING,
				required_error: messages.TOKEN_IS_REQUIRED,
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
	public static format(issues: ZodIssue[]) {
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

		return response.errors;
	}
}

export {
	ErrorFormatter,
	roleNameValidator,
	uuidValidator,
	passwordValidator,
	JWTTokenValidator,
	avatarUrlValidator,
	emailValidator,
	nameValidator,
};
