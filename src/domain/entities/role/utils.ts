import {
	type NewRole,
	type OldRole,
	type Params,
	ValidRoles,
} from './protocols';
class RoleUtils {
	public static validateRoleName(name: string): void {
		if (!Object.values(ValidRoles).includes(name as ValidRoles)) {
			throw new Error('Invalid role name');
		}
	}

	public static processUpdates(
		oldRole: OldRole,
		newRole: NewRole,
		updates: Partial<Params>,
		ignoredKeys: Set<string>,
	): boolean {
		let hasChanges = false;
		for (const [key, value] of Object.entries(oldRole)) {
			if (ignoredKeys.has(key)) continue;
			if (value !== newRole[key as keyof NewRole]) {
				updates[key as keyof Params] = newRole[key as keyof NewRole];
				hasChanges = true;
			}
		}
		return hasChanges;
	}
}
export { RoleUtils };
