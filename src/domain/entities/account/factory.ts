import type { HashManager } from '@/domain/cryptography/hash-manager';
import type { RoleDto } from '@/domain/dto/role';
import { AccessForbiddenError, messages } from '@/domain/errors';
import { ValidRoles } from '../role';
import { Account } from './account';
import type { Validator } from './protocols';

class AccountValidator {
	static validate(params: AccountParams, validator: Validator): void {
		validator.create({
			name: params.name,
			email: params.email,
			password: params.password,
		});
		validator.roleId(params.role.id);
	}
}

class PermissionService {
	static validatePermissions(role: RoleDto, isManager: boolean): void {
		if (
			!isManager &&
			[ValidRoles.ADMIN, ValidRoles.MANAGER].includes(role.name as ValidRoles)
		) {
			throw new AccessForbiddenError(messages.UNAUTHORIZED);
		}
	}
}

class AccountFactory {
	static async create(data: AccountRegistrationData): Promise<Account> {
		const { params, isManager, hashManager, validator } = data;

		// Validação de dados de entrada
		AccountValidator.validate(params, validator);
		PermissionService.validatePermissions(params.role, isManager);

		// Criação da conta
		return await AccountFactory.createAccount(params, hashManager);
	}

	private static async createAccount(
		params: AccountParams,
		hashManager: HashManager,
	): Promise<Account> {
		const passwordHashed = await hashManager.hash(params.password);
		return Account.create({
			email: params.email,
			name: params.name,
			password: passwordHashed,
			roleId: params.role.id,
		});
	}
}

type AccountParams = {
	role: RoleDto; // O papel atribuído ao usuário
	name: string; // Nome completo do usuário
	email: string; // Email do usuário
	password: string; // Senha do usuário
};

type AccountRegistrationData = {
	params: AccountParams; // Parâmetros específicos para a criação da conta
	validator: Validator; // Validador para validar dados de entrada
	hashManager: HashManager; // Gerenciador de hashing para proteger a senha
	isManager: boolean; // Indica se o usuário que está criando a conta é um manager
};

export { AccountFactory }; // Exportando UserRole para uso
