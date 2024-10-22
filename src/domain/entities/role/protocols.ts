import type { RoleDto } from '@/domain/dto/role';

interface Validator {
	validateCreate(params: Record<string, unknown>): RoleResponse;
	validateUpdate(params: Record<string, unknown>): {
		name: keyof typeof ValidRoles;
	};
}

type RoleResponse = {
	name: 'ADMIN' | 'MANAGER' | 'CLIENT';
	id?: string | undefined;
};
enum ValidRoles {
	ADMIN = 'ADMIN',
	MANAGER = 'MANAGER',
	CLIENT = 'CLIENT',
}
type Params = {
	name: string;
	id?: string;
};
type OldRole = RoleDto;
type NewRole = {
	name: string;
};
type UpdateParams = {
	newRole: NewRole;
	oldRole: OldRole;
};

export {
	type Params,
	type RoleResponse,
	type UpdateParams,
	ValidRoles,
	type Validator,
	type NewRole,
	type OldRole,
};
