import { errorMessage } from '@/application/message/error-message';
import {
	leastOneNumber,
	leastOneSpecialCharacter,
	leastOneUppercase,
} from '@/application/utils/regex';
import z from 'zod';

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
	return z
		.enum(['user', 'super', 'admin'], {
			invalid_type_error: errorMessage.INVALID_ROLE,
			message: errorMessage.INVALID_ROLE,
		})
		.default('user');
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

export { emailValidator, nameValidator, passwordValidator, roleValidator };
