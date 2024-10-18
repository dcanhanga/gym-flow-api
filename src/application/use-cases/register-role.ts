import { InvalidParamsError } from '../errors/invalid-params';
import { messages } from '../errors/message';
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists';
import type { RoleRepository } from '../repositories/role-repository';
import type { RegisterRoleValidator } from '../validators/interfaces/register-role-validator';
import type {
	RegisterRole,
	RegisterRoleParams,
	RegisterRoleResult,
} from './interfaces/register-role';

class RegisterRoleUseCase implements RegisterRole {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly registerRoleValidator: RegisterRoleValidator,
	) {}
	async register(params: RegisterRoleParams): Promise<RegisterRoleResult> {
		const hasError = this.registerRoleValidator.validate(params);

		if (hasError) {
			throw new InvalidParamsError(
				messages.INVALID_INPUT_PARAMETERS,
				hasError.errors,
			);
		}

		const roleAlreadyExists = await this.roleRepository.findByName(params.name);
		if (roleAlreadyExists) {
			throw new ResourceAlreadyExistsError(messages.THE_ROLE_ALREADY_EXISTS);
		}
		const role = await this.roleRepository.register(params.name);
		return role;
	}
}

export { RegisterRoleUseCase };
