interface Validator {
	validate(params: Record<string, unknown>): RoleParams | ErrorResponse;
}
type ErrorResponse = {
	errors: Record<string, string>;
};
type RoleParams = {
	name: 'ADMIN' | 'MANAGER' | 'CLIENT';
	id?: string | undefined;
};

export type { Validator, ErrorResponse, RoleParams };
