import { InvalidParams } from '@/domain/errors/invalid-params';
import { ResourceAlreadyExists } from '@/domain/errors/resource-already-exists';
import { ResourceNotFound } from '@/domain/errors/resource-not-found';
import { errorMessage } from '@/domain/message/error-message';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';
import type { RoleRepository } from '@/domain/repositories/role-repository';
import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';
import type { BcryptService } from './protocols/bcrypt';
import type { RegisterAccountServiceValidator } from './protocols/register-account-service-validator';

class RegisterAccountService implements RegisterAccountUseCase {
	constructor(
		private readonly registerAccountRepository: RegisterAccountRepository,
		private readonly roleRepository: RoleRepository,
		private readonly bcryptService: BcryptService,
		private readonly registerAccountServiceValidator: RegisterAccountServiceValidator,
	) {}
	async register(
		params: RegisterAccountUseCase.Params,
	): Promise<RegisterAccountUseCase.Result> {
		const { email, password, name, role } = params;
		const hasInvalidParams =
			this.registerAccountServiceValidator.validate(params);

		if (hasInvalidParams) {
			throw new InvalidParams(
				errorMessage.INVALID_PARAMS,
				hasInvalidParams.errors,
			);
		}

		const emailAlreadyExists =
			await this.registerAccountRepository.findByEmail(email);
		if (emailAlreadyExists) {
			throw new ResourceAlreadyExists(errorMessage.EMAIL_ALREADY_EXISTS);
		}

		const foundRole = await this.roleRepository.findByName(role);

		if (!foundRole) {
			throw new ResourceNotFound(errorMessage.ROLE_NOT_FOUND);
		}

		const passwordHashed = await this.bcryptService.hash(password);
		const account = await this.registerAccountRepository.register({
			email,
			name,
			password: passwordHashed,
			roleId: foundRole.id,
		});

		return account;
	}
}
export { RegisterAccountService };
