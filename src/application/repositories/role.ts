import type { Role } from '../../domain/entities/role1';

export interface RoleRepository {
	findByName(name: string): Promise<Role>;
}

export namespace RoleRepository {
	export type AssignRoleParams = {
		accountId: string;
		roleId: string;
	};
}
