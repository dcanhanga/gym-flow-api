import type { TokenGenerator } from '@/application/auth';
import type { AccountDto } from '@/domain/dto/account';
import {
	AccessForbiddenError,
	AuthenticationRequiredError,
	messages,
} from '@/domain/errors';
import type { AccountRepository, RoleRepository } from '@/domain/repositories';
import type {
	LoadAccountByToken,
	LoadAccountByTokenParams,
	LoadAccountByTokenResult,
	LoadAccountByTokenValidator,
} from './protocols/load-by-token';

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
		const { token } = this.tokenValidator.validate(params);
		const { userId } = this.validateToken(token);
		const account = await this.accountRepository.findById(userId);
		if (!account) {
			throw new AuthenticationRequiredError(messages.ACESSES_DENIED);
		}
		await this.checkPermissions(account);
		return account;
	}

	private async checkPermissions(account: AccountDto) {
		if (this.requiredRole) {
			const roleFounded = await this.roleRepository.findById(account.roleId);
			const hasPermission =
				roleFounded && this.requiredRole.includes(roleFounded.name);
			if (!hasPermission) {
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

export { LoadAccountByTokenUseCase };
