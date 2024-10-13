import { messages } from '@/application/errors/message';
import type { ErrorResponse } from '@/application/validators/interfaces/error-response';
import {
	leastOneNumber,
	leastOneSpecialCharacter,
	leastOneUppercase,
} from '@/application/validators/utils/regex';
import z, { type ZodIssue } from 'zod';

function emailValidator() {
	return z
		.string({
			required_error: messages.EMAIL_IS_REQUIRED,
			invalid_type_error: messages.EMAIL_MUST_BE_A_STRING,
		})
		.email({ message: messages.INVALID_EMAIL });
}
function nameValidator() {
	return z.string({
		required_error: messages.NAME_IS_REQUIRED,
		invalid_type_error: messages.NAME_MUST_BE_A_STRING,
	});
}
function roleValidator() {
	return z.enum(['ADMIN', 'SUPER', 'USER'], {
		message: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
	});
}
function passwordValidator() {
	return z
		.string({
			required_error: messages.PASSWORD_IS_REQUIRED,
			invalid_type_error: messages.PASSWORD_MUST_BE_A_STRING,
		})
		.min(8, {
			message: messages.PASSWORD_MUST_HAVE_AT_LEAST_EIGHT_CHARACTERS,
		})

		.regex(leastOneNumber, {
			message: messages.PASSWORD_MUST_HAVE_AT_LEAST_ONE_NUMBER,
		})
		.regex(leastOneUppercase, {
			message: messages.PASSWORD_MUST_HAVE_AT_LEAST_ONE_CAPITAL_LETTER,
		})
		.regex(leastOneSpecialCharacter, {
			message: messages.PASSWORD_MUST_HAVE_AT_LEAST_ONE_SPECIAL_LETTER,
		});
}
function formatErrorResponse(issues: ZodIssue[]): ErrorResponse {
	const response: ErrorResponse = {
		errors: {},
	};

	for (const issue of issues) {
		if (issue.code === 'unrecognized_keys') {
			response.errors[issue.keys[0]] = issue.message;
		} else {
			response.errors[issue.path[0]] = issue.message;
		}
	}

	return response;
}
export {
	emailValidator,
	nameValidator,
	passwordValidator,
	roleValidator,
	formatErrorResponse,
};
