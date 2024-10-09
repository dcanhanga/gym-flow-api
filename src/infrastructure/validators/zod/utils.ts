import {
	leastOneNumber,
	leastOneSpecialCharacter,
	leastOneUppercase,
} from '@/application/utils/regex';
import { validatorMessage } from '@/application/validator-message';
import z from 'zod';

function emailValidator() {
	return z
		.string({
			required_error: validatorMessage.EMAIL_IS_REQUIRED,
			invalid_type_error: validatorMessage.EMAIL_MUST_BE_A_STRING,
		})
		.email({ message: validatorMessage.INVALID_EMAIL });
}
function nameValidator() {
	return z.string({
		required_error: validatorMessage.NAME_IS_REQUIRED,
		invalid_type_error: validatorMessage.NAME_MUST_BE_A_STRING,
	});
}
function roleValidator() {
	return z
		.enum(['user', 'super', 'admin'], {
			invalid_type_error: validatorMessage.INVALID_ROLE,
			message: validatorMessage.INVALID_ROLE,
		})
		.default('user');
}
function passwordValidator() {
	return z
		.string({
			required_error: validatorMessage.PASSWORD_IS_REQUIRED,
			invalid_type_error: validatorMessage.PASSWORD_MUST_BE_A_STRING,
		})
		.min(8, {
			message: validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_EIGHT_CHARACTERS,
		})

		.regex(leastOneNumber, {
			message: validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_NUMBER,
		})
		.regex(leastOneUppercase, {
			message: validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_CAPITAL_LETTER,
		})
		.regex(leastOneSpecialCharacter, {
			message: validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_SPECIAL_LETTER,
		});
}

export { emailValidator, nameValidator, passwordValidator, roleValidator };
