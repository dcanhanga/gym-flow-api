import { DomainError } from '@/shared/errors/index.js';
import {
	type ValidRole,
	ValidRoles,
} from '@/shared/utils/enums/valid-roles.js';
import { messages } from '@/shared/utils/messages.js';
import { Result } from '@/shared/utils/result.js';

export class RoleService {
	public static validateName(name: string): Result<null, DomainError> {
		const isValidName = Object.values(ValidRoles).includes(name as ValidRoles);
		if (!isValidName) {
			return Result.fail(
				new DomainError(messages.INVALID_ROLE_NAME, {
					providedName: name,
					validRoles: RoleService.getValidRoles(),
				}),
			);
		}
		return Result.ok(null);
	}
	public static validatePermission(
		createdBy: ValidRole,
	): Result<null, DomainError> {
		const hasPermission = createdBy === ValidRoles.Manager;
		if (!hasPermission) {
			return Result.fail(
				new DomainError(messages.INSUFFICIENT_PERMISSIONS_TO_CREATE_ROLE, {
					requiredRole: 'Manager',
					providedRole: createdBy,
				}),
			);
		}

		return Result.ok(null);
	}
	public static isAdmin(role: ValidRoles): boolean {
		return role === ValidRoles.Admin;
	}

	public static getValidRoles(): ValidRole[] {
		return Object.values(ValidRoles);
	}
}
