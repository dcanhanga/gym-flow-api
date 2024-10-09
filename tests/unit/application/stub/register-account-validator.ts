import type { RegisterAccountServiceValidator } from '@/application/services/protocols/register-account-service-validator';

class StubRegisterAccountValidator implements RegisterAccountServiceValidator {
	validate(
		_fields: RegisterAccountServiceValidator.Fields,
	): RegisterAccountServiceValidator.ErrorResponse | null {
		return null;
	}
}
export { StubRegisterAccountValidator };
