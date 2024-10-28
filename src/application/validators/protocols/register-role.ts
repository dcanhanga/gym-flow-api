import type { ValidRoles } from '@/domain/entities/role';

export interface RegisterRoleValidator {
	check(params: RegisterRoleValidator.Params): RegisterRoleValidator.Result;
}
export namespace RegisterRoleValidator {
	export type Params = Record<string, unknown>;
	export type Result = {
		accountId: string;
		name: keyof typeof ValidRoles;
	};
}
