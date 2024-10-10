import { errorMessage } from '@/application/message/error-message';
import type { ErrorResponse } from '@/application/services/interfaces/error-response';
import {
	leastOneNumber,
	leastOneSpecialCharacter,
	leastOneUppercase,
} from '@/application/utils/regex';
import z, { type ZodIssue } from 'zod';

function emailValidator() {
	return z
		.string({
			required_error: errorMessage.EMAIL_IS_REQUIRED,
			invalid_type_error: errorMessage.EMAIL_MUST_BE_A_STRING,
		})
		.email({ message: errorMessage.INVALID_EMAIL });
}
function nameValidator() {
	return z.string({
		required_error: errorMessage.NAME_IS_REQUIRED,
		invalid_type_error: errorMessage.NAME_MUST_BE_A_STRING,
	});
}
function roleValidator() {
	return z.enum(['user', 'super', 'admin'], {
		message: errorMessage.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
	});
}
function passwordValidator() {
	return z
		.string({
			required_error: errorMessage.PASSWORD_IS_REQUIRED,
			invalid_type_error: errorMessage.PASSWORD_MUST_BE_A_STRING,
		})
		.min(8, {
			message: errorMessage.PASSWORD_MUST_HAVE_AT_LEAST_EIGHT_CHARACTERS,
		})

		.regex(leastOneNumber, {
			message: errorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_NUMBER,
		})
		.regex(leastOneUppercase, {
			message: errorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_CAPITAL_LETTER,
		})
		.regex(leastOneSpecialCharacter, {
			message: errorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_SPECIAL_LETTER,
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
