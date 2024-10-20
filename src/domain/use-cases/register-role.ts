import type { Role } from '@/domain/entities/role1';

interface RegisterRole {
	register(params: RegisterRoleParams): Promise<RegisterRoleResult>;
}
type RegisterRoleParams = { name: 'ADMIN' | 'MANAGER' | 'CLIENT' };
type RegisterRoleResult = Role;
export type { RegisterRole, RegisterRoleParams, RegisterRoleResult };
