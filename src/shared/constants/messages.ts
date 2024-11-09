const messages = {
	PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
	PASSWORD_NO_NUMBER: 'PASSWORD_NO_NUMBER',
	PASSWORD_NO_UPPERCASE: 'PASSWORD_NO_UPPERCASE',
	PASSWORD_NO_SPECIAL_CHAR: 'PASSWORD_NO_SPECIAL_CHAR',
	INVALID_ID_FORMAT: 'INVALID_ID_FORMAT',
	INVALID_UUID_FORMAT: 'INVALID_UUID_FORMAT',
	INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
	INVALID_NAME_FORMAT: 'INVALID_NAME_FORMAT',
	INVALID_ROLE_NAME: 'INVALID_ROLE_NAME',
	INVALID_PHONE_FORMAT: 'INVALID_PHONE_FORMAT',
	INVALID_URL_FORMAT: 'INVALID_URL_FORMAT',
	ROLE_MANAGER_PERMISSION_REQUIRED: 'ROLE_MANAGER_PERMISSION_REQUIRED',
	ACCESS_DENIED: 'ACCESS_DENIED',
	ROLE_MUST_BE_MANAGER_ADMIN_OR_USER: 'ROLE_MUST_BE_MANAGER_ADMIN_OR_USER',
	ID_IS_REQUIRED: 'ID_IS_REQUIRED',
	UNRECOGNIZED_FIELD: 'UNRECOGNIZED_FIELD',
	INVALID_INPUT_PARAMETERS: 'INVALID_INPUT_PARAMETERS',
	INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
	ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
	ROLE_ALREADY_EXISTS: 'ROLE_ALREADY_EXISTS',
	INVALID_LATITUDE_PROVIDED:
		'LATITUDE_PROVIDED_(value)_IS_INVALID_IT_MUST_BE_BETWEEN_[-90,90]',
	INVALID_LONGITUDE_PROVIDED:
		'LONGITUDE_PROVIDED_(value)_IS_INVALID_IT_MUST_BE_BETWEEN_[-180,180]',
	INSUFFICIENT_PERMISSIONS_TO_CREATE_ROLE:
		'Insufficient permissions to create role'.toUpperCase(),
} as const;
export { messages };

export function formatExpectedTypeMismatch(
	expected: string,
	received: string,
): string {
	return `EXPECTED_${expected.toUpperCase()}_RECEIVED_${received.toUpperCase()}`;
}
