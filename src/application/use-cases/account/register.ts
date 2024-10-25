import type { HashManager } from '@/domain/cryptography/hash-manager';
import type { AccountDto } from '@/domain/dto/account';
import type { Account, Validator } from '@/domain/entities/account';
import { AccountFactory } from '@/domain/entities/account/factory';
import { ValidRoles } from '@/domain/entities/role';
import { ResourceConflictError, ResourceNotFoundError } from '@/domain/errors';
import type { AccountRepository, RoleRepository } from '@/domain/repositories';
import type {
	RegisterAccount,
	RegisterAccountParams,
} from './protocols/register';

class RegisterAccountUseCase implements RegisterAccount {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly accountRepository: AccountRepository,
		private readonly hashManager: HashManager,
		private readonly validator: Validator,
	) {}

	async register(params: RegisterAccountParams): Promise<AccountDto> {
		const { email, roleId } = params;

		// Primeiro verifica o email e o roleId antes de criar a conta
		await this.checkoutEmail(email);
		const role = roleId
			? await this.checkoutRoleId(roleId)
			: await this.findRole(ValidRoles.CLIENT);

		const account = await AccountFactory.create({
			hashManager: this.hashManager,
			validator: this.validator,
			isManager: role.name === ValidRoles.MANAGER,
			params: {
				email,
				role,
				name: params.name,
				password: params.password,
			},
		});
		return this.persistAccount(account);
	}

	private async persistAccount(account: Account) {
		// Persistir a conta após gerar o hash da senha
		const hashedPassword = await this.hashManager.hash(account.getPassword());
		const accountRepository = await this.accountRepository.register({
			email: account.getEmail(),
			password: hashedPassword,
			roleId: account.getRoleId(),
			name: account.getName(),
		});
		return accountRepository;
	}

	private async checkoutRoleId(roleId: string) {
		const role = await this.roleRepository.findById(roleId);
		if (!role) {
			throw new ResourceNotFoundError('Role not found');
		}
		return role;
	}

	private async checkoutEmail(email: string) {
		const account = await this.accountRepository.findByEmail(email);
		if (account) {
			throw new ResourceConflictError('Email already exists');
		}
	}

	private async findRole(roleName: keyof typeof ValidRoles) {
		const role = await this.roleRepository.findByName(roleName);
		if (!role) {
			throw new ResourceNotFoundError('Role not found');
		}
		return role;
	}
}

export { RegisterAccountUseCase };
