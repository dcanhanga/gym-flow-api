import type { Role } from '../entities/role';

export interface RoleRepository {
	findByName(name: string): Promise<Role>;
}

export namespace RoleRepository {
	export type AssignRoleParams = {
		accountId: string;
		roleId: string;
	};
}
