import { randomUUID } from 'node:crypto';

import type {
	RegisterAccount,
	RegisterAccountParams,
	RegisterAccountResult,
} from '@/application/use-cases/interfaces/register-account';

class StubRegisterAccountService implements RegisterAccount {
	async register(
		params: RegisterAccountParams,
	): Promise<RegisterAccountResult> {
		return {
			id: randomUUID(),
			name: params.name,
			email: params.email,
			avatarUrl: null,
			roleId: randomUUID(),
		};
	}
}

export { StubRegisterAccountService };
