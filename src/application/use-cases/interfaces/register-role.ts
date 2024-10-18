import type { Role } from '@/application/entities/role';

interface RegisterRole {
	register(params: RegisterRoleParams): Promise<RegisterRoleResult>;
}
type RegisterRoleParams = { name: 'ADMIN' | 'MANAGER' | 'CLIENT' };
type RegisterRoleResult = Role;
export type { RegisterRole, RegisterRoleParams, RegisterRoleResult };
