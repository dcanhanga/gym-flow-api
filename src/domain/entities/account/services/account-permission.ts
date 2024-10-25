import type { RoleDto } from '@/domain/dto/role';
import { AccessForbiddenError, messages } from '@/domain/errors';
import { ValidRoles } from '../../role';

export class AccountPermissionService {
	static validate(role: RoleDto, isManager: boolean): void {
		if (
			!isManager &&
			[ValidRoles.ADMIN, ValidRoles.MANAGER].includes(role.name as ValidRoles)
		) {
			throw new AccessForbiddenError(messages.UNAUTHORIZED);
		}
	}
}
