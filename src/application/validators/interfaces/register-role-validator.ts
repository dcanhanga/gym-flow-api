import type { RegisterRoleParams } from '@/application/use-cases/interfaces/register-role';
import type { ErrorResponse } from './error-response';

interface RegisterRoleValidator {
	validate(data: RegisterRoleFields): ErrorResponse;
}
type RegisterRoleFields = RegisterRoleParams;
export type { RegisterRoleValidator, RegisterRoleFields };
