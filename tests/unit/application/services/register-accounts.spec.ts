import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BcryptService } from '@/application/services/protocols/bcrypt';
import type { RegisterAccountServiceValidator } from '@/application/services/protocols/register-account-service-validator';
import { RegisterAccountService } from '@/application/services/register-account';
import { InvalidParams } from '@/domain/errors/invalid-params';
import { ResourceAlreadyExists } from '@/domain/errors/resource-already-exists';
import { ResourceNotFound } from '@/domain/errors/resource-not-found';
import { errorMessage } from '@/domain/message/error-message';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';
import type { RoleRepository } from '@/domain/repositories/role-repository';
import { generateAccountToRegister } from '@/tests/utils/generate-account-to-register';
import { StubBcryptService } from '../stub/bcrypt-service';
import { StubRegisterAccountRepository } from '../stub/register-account-repository';
import { StubRegisterAccountValidator } from '../stub/register-account-validator';
import { StubRoleRepository } from '../stub/role-repository';

describe('RegisterAccountService', () => {
	let registerAccountRepository: RegisterAccountRepository;
	let roleRepository: RoleRepository;
	let bcryptService: BcryptService;
	let registerAccountServiceValidator: RegisterAccountServiceValidator;
	let sut: RegisterAccountService;

	beforeEach(() => {
		registerAccountRepository = new StubRegisterAccountRepository();
		roleRepository = new StubRoleRepository();
		bcryptService = new StubBcryptService();
		registerAccountServiceValidator = new StubRegisterAccountValidator();
		sut = new RegisterAccountService(
			registerAccountRepository,
			roleRepository,
			bcryptService,
			registerAccountServiceValidator,
		);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});
	describe('Cenários de erro', () => {
		it('deve lançar um erro ResourceAlreadyExists quando um usuário com o mesmo e-mail já está cadastrado', async () => {
			const account = generateAccountToRegister('user');

			const registerAccountRepositorySpy = vi.spyOn(
				registerAccountRepository,
				'findByEmail',
			);

			registerAccountRepositorySpy.mockResolvedValue({
				id: randomUUID(),
				email: account.email,
				name: account.name,
				password: account.password,
				roleId: randomUUID(),
				avatarUrl: null,
			});

			const result = sut.register(account);
			await expect(result).rejects.toEqual(
				new ResourceAlreadyExists(errorMessage.EMAIL_ALREADY_EXISTS),
			);

			expect(registerAccountRepositorySpy).toHaveBeenCalledWith(account.email);
			expect(registerAccountRepositorySpy).toHaveBeenCalledTimes(1);
		});

		it('deve lançar ResourceNotFound se o role fornecido não existir', async () => {
			const account = generateAccountToRegister('user');

			const roleRepositorySpy = vi.spyOn(roleRepository, 'findByName');
			roleRepositorySpy.mockResolvedValue(null);

			const result = sut.register(account);

			await expect(result).rejects.toEqual(
				new ResourceNotFound(errorMessage.ROLE_NOT_FOUND),
			);

			expect(roleRepositorySpy).toBeCalledWith(account.role);
			expect(roleRepositorySpy).toBeCalledTimes(1);
		});

		it('deve lançar um erro se a validação falhar', async () => {
			const account = generateAccountToRegister('user');

			const mockValidationResult = {
				errors: {
					email: 'Invalid',
					name: 'Invalid',
					password: 'Invalid',
					role: 'Invalid',
				},
			};

			vi.spyOn(registerAccountServiceValidator, 'validate').mockReturnValueOnce(
				mockValidationResult,
			);

			const result = sut.register(account);
			await expect(result).rejects.toEqual(
				new InvalidParams(
					errorMessage.INVALID_PARAMS,
					mockValidationResult.errors,
				),
			);

			expect(registerAccountServiceValidator.validate).toBeCalledWith(account);
			expect(registerAccountServiceValidator.validate).toHaveBeenCalledTimes(1);
		});
	});

	describe('Cenários de sucesso', () => {
		it('deve fazer o hash da senha quando uma conta é registrada com sucesso', async () => {
			const account = generateAccountToRegister('user');
			const bcryptServiceSpy = vi.spyOn(bcryptService, 'hash');

			bcryptServiceSpy.mockResolvedValueOnce('hashedPassword');

			await sut.register(account);

			expect(bcryptServiceSpy).toHaveBeenCalledWith(account.password);
			expect(bcryptServiceSpy).toBeCalledTimes(1);
		});

		it('deve registrar uma nova conta quando os dados forem válidos', async () => {
			const account = generateAccountToRegister('user');
			const registeredAccount = await sut.register(account);

			expect(registeredAccount).toHaveProperty('id');
			expect(registeredAccount.email).toStrictEqual(account.email);
			expect(registeredAccount.name).toStrictEqual(account.name);
		});
	});
});
