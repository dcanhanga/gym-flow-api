import type { Role } from '../entities/role';
import type { RegisterRoleParams } from '../use-cases/interfaces/register-role';

interface RoleRepository {
	findByName(roleName: RoleName): Promise<FindByNameResponse>;
	findById(roleId: string): Promise<FindByIdResponse>;
	register(roleName: RoleName): Promise<RegisterResponse>;
}

type ResponsePossibleNull = Role | null;
type RoleName = RegisterRoleParams['name'];
type FindByNameResponse = ResponsePossibleNull;
type FindByIdResponse = ResponsePossibleNull;
type RegisterResponse = {
	id: string;
	name: string;
};

export type {
	RoleRepository,
	RoleName,
	FindByNameResponse,
	FindByIdResponse,
	RegisterResponse,
};
