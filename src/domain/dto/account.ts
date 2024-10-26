import type { RoleDto } from './role';

export type AccountDto = {
	id: string;
	name: string;
	email: string;
	password: string;
	avatarUrl: string | null;
	roleId: string;
};

export type CreateAccountDto = {
	name: string;
	email: string;
	password: string;
	role: RoleDto;
	isManager: boolean;
};

// type AccountValidationResultDto = {
// 	name: string;
// 	email: string;
// 	password: string;
// };
