import type { RoleDto } from './role';
export type BaseAccountDto = {
	name: string;
	email: string;
	password: string;
};
export type AccountDto = BaseAccountDto & {
	id: string;
	avatarUrl: string | null;
	roleId: string;
};

export type AccountEntityCreationDto = BaseAccountDto & {
	role: RoleDto;
	isManager: boolean;
};

export type AccountRegistrationDto = BaseAccountDto & {
	id?: string;
	avatarUrl: string | null;
	roleId: string;
};

export type AccountWithRoleDto = Omit<AccountDto, 'roleId'> & {
	role: RoleDto;
};
