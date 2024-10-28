import type { RoleDto } from '../dto/role';
import type { ValidRoles } from '../entities/role';

export interface RoleRepository {
	findByName(roleName: string): Promise<OptionalRole>;
	findById(roleId: string): Promise<OptionalRole>;
	register(params: RegisterRoleParams): Promise<RoleDto>;
}

export type OptionalRole = RoleDto | null;
export type RegisterRoleParams = {
	name: keyof typeof ValidRoles;
	id?: string;
};
