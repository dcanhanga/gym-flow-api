import type { Role } from '../../domain/entities/role1';
interface RoleRepository {
	findByName(roleName: string): Promise<OptionalRoleResponse>;
	findById(roleId: string): Promise<OptionalRoleResponse>;
	register(roleName: string): Promise<NewRoleResponse>;
}
type OptionalRoleResponse = Role | null;
type NewRoleResponse = {
	id: string;
	name: string;
};
export type { RoleRepository, OptionalRoleResponse, NewRoleResponse };
