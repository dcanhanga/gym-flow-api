import { type Params, Role, type Validator } from '@/domain/entities/role';
import { ResourceConflictError, messages } from '@/domain/errors';
import type { RoleRepository } from '@/domain/repositories';
import type { RegisterRole } from './protocols/register';

class RegisterRoleUseCase implements RegisterRole {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly validator: Validator,
	) {}
	async register(params: Params): Promise<void> {
		const role = Role.create({ name: params.name }, this.validator);

		const roleAlreadyExists = await this.roleRepository.findByName(
			role.getName(),
		);
		if (roleAlreadyExists) {
			throw new ResourceConflictError(messages.ROLE_ALREADY_EXISTS);
		}
		await this.roleRepository.register({ name: role.getName() });
	}
}

export { RegisterRoleUseCase };
