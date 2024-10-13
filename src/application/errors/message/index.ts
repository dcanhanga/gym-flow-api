const messages = {
	ROLE_ALREADY_EXISTS: 'ROLE_ALREADY_EXISTS',
	UNRECOGNIZED_FIELD: 'UNRECOGNIZED_FIELD',
	NOT_FOUND: 'NOT_FOUND',
	UNAUTHORIZED: 'UNAUTHORIZED',
	FORBIDDEN: 'FORBIDDEN',
	EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
	ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
	INVALID_PARAMS: 'INVALID_PARAMS',
	NAME_MUST_BE_A_STRING: 'NAME_MUST_BE_A_STRING',
	NAME_IS_REQUIRED: 'NAME_IS_REQUIRED',
	EMAIL_MUST_BE_A_STRING: 'EMAIL_MUST_BE_A_STRING',
	EMAIL_IS_REQUIRED: 'EMAIL_IS_REQUIRED',
	PASSWORD_MUST_BE_A_STRING: 'PASSWORD_MUST_BE_A_STRING',
	PASSWORD_IS_REQUIRED: 'PASSWORD_IS_REQUIRED',
	ROLE_MUST_BE_A_STRING: 'ROLE_MUST_BE_A_STRING',
	INVALID_ROLE: 'INVALID_ROLE',
	ROLE_IS_REQUIRED: 'ROLE_IS_REQUIRED',
	INVALID_EMAIL: 'INVALID_EMAIL',
	PASSWORD_MUST_HAVE_AT_LEAST_EIGHT_CHARACTERS:
		'PASSWORD_MUST_HAVE_AT_LEAST_EIGHT_CHARACTERS',
	PASSWORD_MUST_HAVE_AT_LEAST_ONE_NUMBER:
		'PASSWORD_MUST_HAVE_AT_LEAST_ONE_NUMBER',
	PASSWORD_MUST_HAVE_AT_LEAST_ONE_CAPITAL_LETTER:
		'PASSWORD_MUST_HAVE_AT_LEAST_ONE_CAPITAL_LETTER',
	PASSWORD_MUST_HAVE_AT_LEAST_ONE_SPECIAL_LETTER:
		'PASSWORD_MUST_HAVE_AT_LEAST_ONE_SPECIAL_LETTER',
	INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
	ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER: 'ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER',
} as const;
export { messages };