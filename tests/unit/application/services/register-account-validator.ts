import type {
	RegisterAccountErrorResponse,
	RegisterAccountFields,
	RegisterAccountValidator,
} from '@/application/services/interfaces/register-account-validator';

class StubRegisterAccountValidator implements RegisterAccountValidator {
	validate(_fields: RegisterAccountFields): RegisterAccountErrorResponse {
		return null;
	}
}
export { StubRegisterAccountValidator };
