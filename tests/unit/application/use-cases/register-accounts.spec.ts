import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InvalidParams } from '@/application/errors/invalid-params';
import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import { ResourceNotFound } from '@/application/errors/resource-not-found';
import { errorMessage } from '@/application/message/error-message';
import type { Bcrypt } from '@/application/services/interfaces/bcrypt';
import type { RegisterAccountValidator } from '@/application/services/interfaces/register-account-validator';
import { RegisterAccountUseCase } from '@/application/use-cases/register-account';
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
	let bcryptService: Bcrypt;
	let registerAccountServiceValidator: RegisterAccountValidator;
	let registerAccountService: RegisterAccountUseCase;

	beforeEach(() => {
		registerAccountRepository = new StubRegisterAccountRepository();
		roleRepository = new StubRoleRepository();
		bcryptService = new StubBcryptService();
		registerAccountServiceValidator = new StubRegisterAccountValidator();
		registerAccountService = new RegisterAccountUseCase(
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
			const resourceAlreadyExists = new ResourceAlreadyExists(
				errorMessage.EMAIL_ALREADY_EXISTS,
			);

			registerAccountRepositorySpy.mockResolvedValue({
				id: randomUUID(),
				email: account.email,
				name: account.name,
				password: account.password,
				roleId: randomUUID(),
				avatarUrl: null,
			});

			const result = registerAccountService.register(account);

			await expect(result).rejects.toEqual(resourceAlreadyExists);
			expect(registerAccountRepositorySpy).toHaveBeenCalledWith(account.email);
			expect(registerAccountRepositorySpy).toHaveBeenCalledTimes(1);
		});

		it('deve lançar ResourceNotFound se o role fornecido não existir', async () => {
			const account = generateAccountToRegister('user');
			const roleRepositorySpy = vi.spyOn(roleRepository, 'findByName');
			const resourceNotFound = new ResourceNotFound(
				errorMessage.ROLE_NOT_FOUND,
			);

			roleRepositorySpy.mockResolvedValue(null);

			const result = registerAccountService.register(account);

			await expect(result).rejects.toEqual(resourceNotFound);
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
			const invalidParams = new InvalidParams(
				errorMessage.INVALID_PARAMS,
				mockValidationResult.errors,
			);

			vi.spyOn(registerAccountServiceValidator, 'validate').mockReturnValueOnce(
				mockValidationResult,
			);

			const result = registerAccountService.register(account);

			await expect(result).rejects.toEqual(invalidParams);
			await expect(result).rejects.toMatchObject({
				message: errorMessage.INVALID_PARAMS,
				errors: mockValidationResult.errors,
			});
			expect(registerAccountServiceValidator.validate).toBeCalledWith(account);
			expect(registerAccountServiceValidator.validate).toHaveBeenCalledTimes(1);
		});
	});

	describe('Cenários de sucesso', () => {
		it('deve fazer o hash da senha quando uma conta é registrada com sucesso', async () => {
			const account = generateAccountToRegister('user');
			const bcryptServiceSpy = vi.spyOn(bcryptService, 'hash');

			bcryptServiceSpy.mockResolvedValueOnce('hashedPassword');

			await registerAccountService.register(account);

			expect(bcryptServiceSpy).toHaveBeenCalledWith(account.password);
			expect(bcryptServiceSpy).toBeCalledTimes(1);
		});

		it('deve armazenar a senha criptografada corretamente no repositório', async () => {
			const account = generateAccountToRegister('user');
			const bcryptServiceSpy = vi
				.spyOn(bcryptService, 'hash')
				.mockResolvedValueOnce('hashedPassword');
			const registerAccountRepositorySpy = vi.spyOn(
				registerAccountRepository,
				'register',
			);

			await registerAccountService.register(account);

			expect(bcryptServiceSpy).toHaveBeenCalledWith(account.password);
			expect(bcryptServiceSpy).toBeCalledTimes(1);
			expect(registerAccountRepositorySpy).toHaveBeenCalledWith(
				expect.objectContaining({
					password: 'hashedPassword',
				}),
			);
		});

		it('deve registrar uma nova conta quando os dados forem válidos', async () => {
			const account = generateAccountToRegister('user');
			const registerAccountRepositorySpy = vi.spyOn(
				registerAccountRepository,
				'register',
			);

			const registeredAccount = await registerAccountService.register(account);

			expect(registerAccountRepositorySpy).toHaveBeenCalledWith(
				expect.objectContaining({
					email: account.email,
					name: account.name,
					password: 'hashedPassword',
					roleId: expect.any(String),
				}),
			);
			expect(registeredAccount).toHaveProperty('id');
		});
	});
});
