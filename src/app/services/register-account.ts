import { ResourceAlreadyExists } from '@/domain/errors/resource-already-exists';
import { errorMessage } from '@/domain/message/error-message';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';

import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';
import type { BcryptService } from './protocols/bcrypt';

class RegisterAccountService implements RegisterAccountUseCase {
	constructor(
		private readonly registerAccountRepository: RegisterAccountRepository,
		private readonly bcryptService: BcryptService,
	) {}
	async register(
		params: RegisterAccountUseCase.Params,
	): Promise<RegisterAccountUseCase.Result> {
		const { email, password } = params;
		const emailAlreadyExists =
			await this.registerAccountRepository.findByEmail(email);

		if (emailAlreadyExists) {
			throw new ResourceAlreadyExists(errorMessage.EMAIL_ALREADY_EXISTS);
		}
		await this.bcryptService.hash(password);

		return null;
	}
}
export { RegisterAccountService };
