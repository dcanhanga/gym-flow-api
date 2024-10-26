import type { RoleDto } from '@/domain/dto/role';
import { DomainError, messages } from '@/domain/errors';
import { ValidRoles } from '../entities/role';

export class AccountPermissionService {
	public static validate({ isManager, role }: Params): void {
		if (
			!isManager &&
			[ValidRoles.Admin, ValidRoles.Manager].includes(role.name as ValidRoles)
		) {
			throw new DomainError(messages.ROLE_MANAGER_PERMISSION_REQUIRED);
		}
	}
}
type Params = {
	role: RoleDto;
	isManager: boolean;
};
