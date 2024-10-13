import type { Role } from '@/application/entities/role';

interface RegisterRole {
	register(params: RegisterRoleParams): Promise<RegisterRoleResult>;
}
type RegisterRoleParams = { name: 'SUPER' | 'ADMIN' | 'USER' };
type RegisterRoleResult = Role;
export type { RegisterRole, RegisterRoleParams, RegisterRoleResult };
