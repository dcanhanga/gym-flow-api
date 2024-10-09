import { RegisterAccountService } from '@/app/services/register-account';
import { ResourceAlreadyExists } from '@/domain/errors/resource-already-exists';
import { errorMessage } from '@/domain/message/error-message';

import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';
import { BcryptJSService } from '@/infra/bcrypt';
import { ZodRegisterAccountValidator } from '@/infra/validators/zod/zod-register-account-validator';
import { InMemoryRegisterAccountRepository } from '@/tests/in-memory-repository/register-account-repository';
import { InMemoryRoleRepository } from '@/tests/in-memory-repository/role-repository';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Register Account Service - Integração', () => {
	let bcryptService: BcryptJSService;
	let registerAccountValidator: ZodRegisterAccountValidator;
	let registerAccountRepository: InMemoryRegisterAccountRepository;
	let roleRepository: InMemoryRoleRepository;
	let sut: RegisterAccountService;

	beforeEach(() => {
		bcryptService = new BcryptJSService();
		registerAccountValidator = new ZodRegisterAccountValidator();
		registerAccountRepository = new InMemoryRegisterAccountRepository();
		roleRepository = new InMemoryRoleRepository();

		sut = new RegisterAccountService(
			registerAccountRepository,
			roleRepository,
			bcryptService,
			registerAccountValidator,
		);

		roleRepository.addRole('user');
	});

	it('deve registrar uma nova conta corretamente', async () => {
		const accountData: RegisterAccountUseCase.Params = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'passworD@123',
			role: 'user',
		};

		const registeredAccount = await sut.register(accountData);
		const result = await registerAccountRepository.findByEmail(
			registeredAccount.email,
		);

		expect(registeredAccount).toStrictEqual({
			id: result?.id,
			email: result?.email,
			name: result?.name,
			avatarUrl: result?.avatarUrl,
			roleId: result?.roleId,
		});
	});

	it('deve fazer o hash da senha antes de registrar a conta', async () => {
		const accountData: RegisterAccountUseCase.Params = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'passworD@123',
			role: 'user',
		};

		await sut.register(accountData);
		const result = await registerAccountRepository.findByEmail(
			accountData.email,
		);

		const isCorrectlyHashedPassword = await bcryptService.compare(
			accountData.password,
			result?.password ?? '',
		);

		expect(isCorrectlyHashedPassword).toBe(true);
	});

	it('não deve permitir registrar um usuário com e-mail duplicado', async () => {
		const accountData: RegisterAccountUseCase.Params = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'passworD@123',
			role: 'user',
		};

		await sut.register(accountData);

		await expect(sut.register(accountData)).rejects.toEqual(
			new ResourceAlreadyExists(errorMessage.EMAIL_ALREADY_EXISTS),
		);
	});

	it('deve lançar erro de validação se os dados estiverem incorretos', async () => {
		const invalidAccountData: RegisterAccountUseCase.Params = {
			email: 'invalid-email',
			name: '',
			password: 'short',
			role: 'user',
		};

		await expect(sut.register(invalidAccountData)).rejects.toThrow(
			errorMessage.INVALID_PARAMS,
		);
	});
});
