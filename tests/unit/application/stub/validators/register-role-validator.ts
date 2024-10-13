import type { ErrorResponse } from '@/application/validators/interfaces/error-response';
import type {
	RegisterRoleFields,
	RegisterRoleValidator,
} from '@/application/validators/interfaces/register-role-validator';

class StubRegisterRoleValidator implements RegisterRoleValidator {
	validate(_fields: RegisterRoleFields): ErrorResponse {
		return null;
	}
}
export { StubRegisterRoleValidator };
