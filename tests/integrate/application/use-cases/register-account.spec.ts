import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import { ResourceNotFound } from '@/application/errors/resource-not-found';
import { errorMessage } from '@/application/message/error-message';
import type { RegisterAccountParams } from '@/application/use-cases/interfaces/register-account';
import { RegisterAccountUseCase } from '@/application/use-cases/register-account';
import { BcryptService } from '@/infrastructure/bcrypt';
import { ZodRegisterAccountValidatorService } from '@/infrastructure/validators/zod/zod-register-account-validator';
import { InMemoryRegisterAccountRepository } from '@/tests/integrate/infrastructure/in-memory-repository/register-account-repository';
import { InMemoryRoleRepository } from '@/tests/integrate/infrastructure/in-memory-repository/role-repository';
import { generateAccountToRegister } from '@/tests/utils/generate-account-to-register';

describe('RegisterAccountUseCase - Integração', () => {
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

	describe('Cenário de sucesso', () => {
		it('deve registrar uma nova conta com sucesso', async () => {
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

		it('deve criptografar a senha antes de registrar a conta', async () => {
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
		it('deve gerar um hash único para cada senha', async () => {
			const accountData1 = generateAccountToRegister('user');
			const accountData2 = generateAccountToRegister('user');

			await sut.register(accountData1);
			await sut.register(accountData2);

			const result1 = await registerAccountRepository.findByEmail(
				accountData1.email,
			);
			const result2 = await registerAccountRepository.findByEmail(
				accountData2.email,
			);

			expect(result1?.password).not.toBe(result2?.password);
		});
	});

	describe('Cenário de erros', () => {
		it('não deve permitir registrar uma conta com e-mail já existente', async () => {
			const accountData = generateAccountToRegister('user');

			await sut.register(accountData);

			await expect(sut.register(accountData)).rejects.toEqual(
				new ResourceAlreadyExists(errorMessage.EMAIL_ALREADY_EXISTS),
			);
		});

		it('deve lançar um erro de validação se os dados fornecidos forem inválidos', async () => {
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

		it('não deve permitir registrar uma conta com uma role inexistente', async () => {
			const accountData = generateAccountToRegister('super');

			await expect(sut.register(accountData)).rejects.toEqual(
				new ResourceNotFound(errorMessage.ROLE_NOT_FOUND),
			);
		});
	});
});
