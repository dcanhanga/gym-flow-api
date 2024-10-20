import { InvalidParametersError, ResourceConflictError } from '@/domain/errors';
import { messages } from '@/domain/errors/message';
import type {
	RegisterRole,
	RegisterRoleParams,
	RegisterRoleResult,
} from '@/domain/use-cases/register-role';
import type { RoleRepository } from '../repositories/role-repository';
import type { RegisterRoleValidator } from '../validators/interfaces/register-role-validator';

class RegisterRoleService implements RegisterRole {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly registerRoleValidator: RegisterRoleValidator,
	) {}
	async register(params: RegisterRoleParams): Promise<RegisterRoleResult> {
		const hasError = this.registerRoleValidator.validate(params);

		if (hasError) {
			throw new InvalidParametersError(
				messages.INVALID_INPUT_PARAMETERS,
				hasError.errors,
			);
		}

		const roleAlreadyExists = await this.roleRepository.findByName(params.name);
		if (roleAlreadyExists) {
			throw new ResourceConflictError(messages.ROLE_ALREADY_EXISTS);
		}
		const role = await this.roleRepository.register(params.name);
		return role;
	}
}

export { RegisterRoleService };
