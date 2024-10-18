import type { TokenGenerator } from '../auth/token-generator';
import type { Account } from '../entities/account';
import { ForbiddenError } from '../errors/forbidden';
import { messages } from '../errors/message';
import { UnauthorizedError } from '../errors/unauthorized';

import type { AccountRepository } from '../repositories/account-repository';
import type { RoleRepository } from '../repositories/role-repository';
import type { LoadAccountByTokenValidator } from '../validators/interfaces/load-account-by-token-validator';
import type {
	LoadAccountByToken,
	LoadAccountByTokenParams,
	LoadAccountByTokenResult,
} from './interfaces/load-account-by-token';

class LoadAccountByTokenUseCase implements LoadAccountByToken {
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
			throw new UnauthorizedError(messages.ACESSES_DENIED);
		}
		const { token } = params;
		const { userId } = this.validateToken(token);
		const account = await this.accountRepository.findById(userId);
		if (!account) {
			throw new UnauthorizedError(messages.ACESSES_DENIED);
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
				throw new ForbiddenError(messages.ACESSES_DENIED);
			}
		}
	}
	private validateToken(token: string) {
		try {
			const verifiedPayload = this.tokenGenerator.verifyToken<{
				userId: string;
			}>(token);

			if (!verifiedPayload) {
				throw new UnauthorizedError(messages.ACESSES_DENIED);
			}
			return verifiedPayload;
		} catch (error) {
			if (
				error instanceof Error &&
				(error.name === 'JsonWebTokenError' ||
					error.name === 'TokenExpiredError')
			) {
				throw new UnauthorizedError(messages.ACESSES_DENIED);
			}

			throw error;
		}
	}
}

export { LoadAccountByTokenUseCase };
