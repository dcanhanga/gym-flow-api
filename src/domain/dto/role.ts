import type { ValidRoles } from '../entities/role';

export type RoleDto = {
	id: string;
	name: string;
};
export type RoleEntityCreationDto = {
	name: keyof typeof ValidRoles;
	id?: string;
	isManager: boolean;
};
export type RoleRegistrationDto = {
	name: string;
	accountId: string;
};
