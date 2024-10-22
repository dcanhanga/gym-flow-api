import type { RoleDto } from '../dto/role';
import type { ValidRoles } from '../entities/role/role';

interface RoleRepository {
	findByName(roleName: string): Promise<OptionalRole>;
	findById(roleId: string): Promise<OptionalRole>;
	register(params: RegisterParams): Promise<RoleDto>;
}

type OptionalRole = RoleDto | null;
type RegisterParams = {
	name: ValidRoles;
	id?: string;
};
export type { RoleRepository, OptionalRole, RegisterParams };
