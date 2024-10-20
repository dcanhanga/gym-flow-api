import { randomUUID } from 'node:crypto';

import type {
	RegisterRole,
	RegisterRoleParams,
	RegisterRoleResult,
} from '@/domain/use-cases/register-role';

class StubRegisterRoleService implements RegisterRole {
	async register(params: RegisterRoleParams): Promise<RegisterRoleResult> {
		return {
			id: randomUUID(),
			name: params.name,
		};
	}
}
export { StubRegisterRoleService };
