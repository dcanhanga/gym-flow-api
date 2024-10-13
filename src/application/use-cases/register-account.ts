// import type { RegisterAccountRepository } from '@/application/repositories/account-repository';
// import type { RoleRepository } from '@/application/repositories/role-repository';
// import { InvalidParams } from '../errors/invalid-params';
// import { messages../errors/message/emessage/messages
// import { ResourceAlreadyExistsxists } from '../errors/resoalreadyeexistsady-exists';
// import { ResourceNotFoundound } from '../eroresource-notnfoundd';
// import type { Bcrypt } from '../crypto/bcrypt';
// import type { RegisterAccountValidator } from '../validators/interfaces/register-account-validator';
// import type {
// 	RegisterAccount,
// 	RegisterAccountParams,
// 	RegisterAccountResult,
// } from './interfaces/register-account';

// class RegisterAccountUseCase implements RegisterAccount {
// 	constructor(
// 		private readonly registerAccountRepository: RegisterAccountRepository,
// 		private readonly roleRepository: RoleRepository,
// 		private readonly bcrypt: Bcrypt,
// 		private readonly registerAccountValidator: RegisterAccountValidator,
// 	) {}
// 	async register(
// 		params: RegisterAccountParams,
// 	): Promise<RegisterAccountResult> {
// 		const { email, password, name, role } = params;
// 		const hasInvalidParams = this.registerAccountValidator.validate(params);

// 		if (hasInvalidParams) {
// 			throw new InvalidParams(
// 				messages.INVALID_PARAMS,
// 				hasInvalidParams.errors,
// 			);
// 		}

// 		const emailAlreadyExists =
// 			await this.registerAccountRepository.findByEmail(email);
// 		if (emailAlreadyExists) {
// 			throw new ResourceAlreadyExists(messages.EMAIL_ALREADY_EXISTS);
// 		}

// 		const foundRole = await this.roleRepository.findByName(role);

// 		if (!foundRole) {
// 			throw new ResourceNotFound(messages.ROLE_NOT_FOUND);
// 		}

// 		const passwordHashed = await this.bcrypt.hash(password);
// 		const account = await this.registerAccountRepository.register({
// 			email,
// 			name,
// 			password: passwordHashed,
// 			roleId: foundRole.id,
// 		});

// 		return account;
// 	}
// }

// export { RegisterAccountUseCase };
