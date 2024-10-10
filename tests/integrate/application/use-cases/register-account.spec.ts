import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import { errorMessage } from '@/application/message/error-message';
import type { RegisterAccountParams } from '@/application/use-cases/interfaces/register-account';
import { RegisterAccountUseCase } from '@/application/use-cases/register-account';
import { BcryptService } from '@/infrastructure/bcrypt';
import { ZodRegisterAccountValidatorService } from '@/infrastructure/validators/zod/zod-register-account-validator';
import { InMemoryRegisterAccountRepository } from '@/tests/integrate/in-memory-repository/register-account-repository';
import { InMemoryRoleRepository } from '@/tests/integrate/in-memory-repository/role-repository';
import { generateAccountToRegister } from '@/tests/utils/generate-account-to-register';

describe('Register Account use case - Integração', () => {
	let bcryptService: BcryptService;
	let registerAccountValidator: ZodRegisterAccountValidatorService;
	let registerAccountRepository: InMemoryRegisterAccountRepository;
	let roleRepository: InMemoryRoleRepository;
	let sut: RegisterAccountUseCase;

	beforeEach(() => {
		bcryptService = new BcryptService();
		registerAccountValidator = new ZodRegisterAccountValidatorService();
		registerAccountRepository = new InMemoryRegisterAccountRepository();
		roleRepository = new InMemoryRoleRepository();

		sut = new RegisterAccountUseCase(
			registerAccountRepository,
			roleRepository,
			bcryptService,
			registerAccountValidator,
		);

		roleRepository.addRole('user');
	});
	afterEach(() => {
		roleRepository.clear();
		registerAccountRepository.clear();
	});
	describe('caso de sucesso', () => {
		it('deve registrar uma nova conta corretamente', async () => {
			const accountData: RegisterAccountParams =
				generateAccountToRegister('user');

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
			const accountData: RegisterAccountParams =
				generateAccountToRegister('user');

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
	});
	describe('caso de erros', () => {
		it('não deve permitir registrar um usuário com e-mail duplicado', async () => {
			const accountData: RegisterAccountParams = {
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
			const invalidAccountData: RegisterAccountParams = {
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
});
