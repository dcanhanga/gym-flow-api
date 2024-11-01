import { ValidRoles } from '@/shared/utils/enums/valid-roles.js';

export class RoleService {
	public static validateName(name: string): boolean {
		return Object.values(ValidRoles).includes(name as ValidRoles);
	}

	public static validateManagerPermission(createdBy: ValidRoles): boolean {
		return createdBy === ValidRoles.Manager;
	}

	public static isAdmin(role: ValidRoles): boolean {
		return role === ValidRoles.Admin;
	}

	public static canManageUsers(role: ValidRoles): boolean {
		return [ValidRoles.Admin, ValidRoles.Manager].includes(role);
	}
}
