import type { RegisterAccountRepository } from '@/domain/repositories/register-account';
import type { RoleRepository } from '@/domain/repositories/role-repository';
import { InvalidParams } from '../errors/invalid-params';
import { ResourceAlreadyExists } from '../errors/resource-already-exists';
import { ResourceNotFound } from '../errors/resource-not-found';
import { errorMessage } from '../message/error-message';
import type { Bcrypt } from '../services/interfaces/bcrypt';
import type { RegisterAccountValidator } from '../services/interfaces/register-account-validator';
import type {
	RegisterAccount,
	RegisterAccountParams,
	RegisterAccountResult,
} from './interfaces/register-account';

class RegisterAccountUseCase implements RegisterAccount {
	constructor(
		private readonly registerAccountRepository: RegisterAccountRepository,
		private readonly roleRepository: RoleRepository,
		private readonly bcrypt: Bcrypt,
		private readonly registerAccountValidator: RegisterAccountValidator,
	) {}
	async register(
		params: RegisterAccountParams,
	): Promise<RegisterAccountResult> {
		const { email, password, name, role } = params;
		const hasInvalidParams = this.registerAccountValidator.validate(params);

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

		const passwordHashed = await this.bcrypt.hash(password);
		const account = await this.registerAccountRepository.register({
			email,
			name,
			password: passwordHashed,
			roleId: foundRole.id,
		});

		return account;
	}
}

export { RegisterAccountUseCase };
