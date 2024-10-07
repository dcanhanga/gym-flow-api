import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BcryptService } from '@/app/services/protocols/bcrypt';
import type { RegisterAccountServiceValidator } from '@/app/services/protocols/register-account-service-validator';
import { RegisterAccountService } from '@/app/services/register-account';
import { InvalidParams } from '@/domain/errors/invalid-params';
import { ResourceAlreadyExists } from '@/domain/errors/resource-already-exists';
import { ResourceNotFound } from '@/domain/errors/resource-not-found';
import { errorMessage } from '@/domain/message/error-message';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';
import type { RoleRepository } from '@/domain/repositories/role-repository';
import { generateAccountToRegister } from '@/tests/utils/generate-account-to-register';
import { InMemoryRegisterAccountRepository } from '../../in-memory-repository/register-account-repository';
import { InMemoryRoleRepository } from '../../in-memory-repository/role-repository';
import { BcryptServiceStub } from './stub/bcrypt-service';
import { RegisterAccountValidatorStub } from './stub/register-account-validator';

describe('RegisterAccountService', () => {
	let registerAccountRepository: RegisterAccountRepository;
	let roleRepository: RoleRepository;
	let bcryptService: BcryptService;
	let registerAccountServiceValidator: RegisterAccountServiceValidator;
	let sut: RegisterAccountService;

	beforeEach(() => {
		registerAccountRepository = new InMemoryRegisterAccountRepository();
		roleRepository = new InMemoryRoleRepository();
		bcryptService = new BcryptServiceStub();
		registerAccountServiceValidator = new RegisterAccountValidatorStub();
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
			const { id: roleId } = await roleRepository.addRole('user');
			const account = generateAccountToRegister('user');

			await registerAccountRepository.register({
				email: account.email,
				name: account.name,
				password: account.password,
				roleId,
			});

			let error: unknown;

			try {
				await sut.register(account);
			} catch (err) {
				error = err;
			}

			expect(error).toBeInstanceOf(ResourceAlreadyExists);

			if (error instanceof ResourceAlreadyExists) {
				expect(error.message).toStrictEqual(errorMessage.EMAIL_ALREADY_EXISTS);
			}
		});

		it('deve lançar ResourceNotFound se o role fornecido não existir', async () => {
			const account = generateAccountToRegister('user');

			let error: unknown;

			try {
				await sut.register(account);
			} catch (err) {
				error = err;
			}

			expect(error).toBeInstanceOf(ResourceNotFound);
			if (error instanceof ResourceNotFound) {
				expect(error.message).toStrictEqual(errorMessage.ROLE_NOT_FOUND);
			}
		});

		it('deve lançar um erro se a validação falhar', async () => {
			await roleRepository.addRole('user');
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

			let error: unknown;

			try {
				await sut.register(account);
			} catch (err) {
				error = err;
			}
			expect(error).toBeInstanceOf(InvalidParams);
			if (error instanceof InvalidParams) {
				expect(error.message).toStrictEqual(errorMessage.INVALID_PARAMS);
				expect(error.errors).toStrictEqual(mockValidationResult.errors);
			}
			expect(registerAccountServiceValidator.validate).toBeCalledWith(account);
		});
	});

	describe('Cenários de sucesso', () => {
		it('deve fazer o hash da senha quando uma conta é registrada com sucesso', async () => {
			const { name } = await roleRepository.addRole('user');
			const account = generateAccountToRegister('user');
			const bcryptServiceSpy = vi.spyOn(bcryptService, 'hash');

			await sut.register({
				...account,
				role: name,
			});
			const registeredAccount = await registerAccountRepository.findByEmail(
				account.email,
			);

			expect(bcryptServiceSpy).toHaveBeenCalledWith(account.password);
			expect(bcryptServiceSpy).toBeCalledTimes(1);
			expect(registeredAccount?.password).toStrictEqual('hashedPassword');
		});

		it('deve registrar uma nova conta quando os dados forem válidos', async () => {
			const { name } = await roleRepository.addRole('user');
			const account = generateAccountToRegister('user');
			const registeredAccount = await sut.register({
				...account,
				role: name,
			});

			expect(registeredAccount).toHaveProperty('id');
			expect(registeredAccount.email).toBe(account.email);
		});
	});
});
