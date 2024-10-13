import { randomUUID } from 'node:crypto';

import type {
	RegisterRole,
	RegisterRoleParams,
	RegisterRoleResult,
} from '@/application/use-cases/interfaces/register-role';

class RegisterRoleUseCaseStub implements RegisterRole {
	async register(params: RegisterRoleParams): Promise<RegisterRoleResult> {
		return {
			id: randomUUID(),
			name: params.name,
		};
	}
}
export { RegisterRoleUseCaseStub };
