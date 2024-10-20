import type { Account } from '@/domain/entities/account';

import {
	AccessForbiddenError,
	AuthenticationRequiredError,
} from '@/domain/errors';
import { messages } from '@/domain/errors/message';
import type {
	LoadAccountByToken,
	LoadAccountByTokenParams,
	LoadAccountByTokenResult,
} from '@/domain/use-cases/load-account-by-token';
import type { TokenGenerator } from '../auth/token-generator';
import type { AccountRepository } from '../repositories/account-repository';
import type { RoleRepository } from '../repositories/role-repository';
import type { LoadAccountByTokenValidator } from '../validators/interfaces/load-account-by-token-validator';

class LoadAccountByTokenService implements LoadAccountByToken {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly roleRepository: RoleRepository,
		private readonly tokenGenerator: TokenGenerator,
		private readonly tokenValidator: LoadAccountByTokenValidator,
		private readonly requiredRole?: string[],
	) {}

	async load(
		params: LoadAccountByTokenParams,
	): Promise<LoadAccountByTokenResult> {
		const hasError = this.tokenValidator.validate(params);
		if (hasError) {
			throw new AuthenticationRequiredError(messages.ACESSES_DENIED);
		}
		const { token } = params;
		const { userId } = this.validateToken(token);
		const account = await this.accountRepository.findById(userId);
		if (!account) {
			throw new AuthenticationRequiredError(messages.ACESSES_DENIED);
		}
		await this.checkPermissions(account);
		return account;
	}

	private async checkPermissions(account: Account) {
		if (this.requiredRole) {
			const roleFounded = await this.roleRepository.findById(account.roleId);
			const hasPermission =
				roleFounded && !this.requiredRole.includes(roleFounded.name);
			if (hasPermission) {
				throw new AccessForbiddenError(messages.ACESSES_DENIED);
			}
		}
	}
	private validateToken(token: string) {
		try {
			const verifiedPayload = this.tokenGenerator.verifyToken<{
				userId: string;
			}>(token);

			if (!verifiedPayload) {
				throw new AuthenticationRequiredError(messages.ACESSES_DENIED);
			}
			return verifiedPayload;
		} catch (error) {
			if (
				error instanceof Error &&
				(error.name === 'JsonWebTokenError' ||
					error.name === 'TokenExpiredError')
			) {
				throw new AuthenticationRequiredError(messages.ACESSES_DENIED);
			}

			throw error;
		}
	}
}

export { LoadAccountByTokenService };
