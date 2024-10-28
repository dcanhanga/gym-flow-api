import { Role } from '@/domain/entities/role';
import { messages } from '@/domain/errors';
import type { AccountRepository, RoleRepository } from '@/domain/repositories';
import { AccessForbiddenError, ResourceConflictError } from '../errors';
import type { RegisterRoleValidator } from '../validators/protocols/register-role';
import type { RegisterRole } from './protocols/register-role';

export class RegisterRoleUseCase implements RegisterRole {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly roleRepository: RoleRepository,
		private readonly registerRoleValidator: RegisterRoleValidator,
	) {}
	async register(params: RegisterRole.Params): Promise<RegisterRole.Result> {
		const { accountId, name } = this.registerRoleValidator.check(params);
		const [account, existingRole] = await Promise.all([
			this.accountRepository.findWithRole(accountId),
			this.roleRepository.findByName(name),
		]);
		const isAccountAllowedToRegisterRole =
			account && account.role.name === Role.ValidRoles.Manager;

		if (!isAccountAllowedToRegisterRole) {
			throw new AccessForbiddenError(messages.ACCESS_DENIED);
		}

		if (existingRole) {
			throw new ResourceConflictError(messages.ROLE_ALREADY_EXISTS);
		}

		const entity = Role.create({
			isManager: isAccountAllowedToRegisterRole,
			name,
		});
		await this.roleRepository.register({
			name: entity.getName(),
			id: entity.getId(),
		});
		return {
			id: entity.getId(),
			name: entity.getName(),
		};
	}
}
