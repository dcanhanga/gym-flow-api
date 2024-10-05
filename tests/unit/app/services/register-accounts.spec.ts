import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BcryptService } from '@/app/services/protocols/bcrypt';
import { RegisterAccountService } from '@/app/services/register-account';
import { ResourceAlreadyExists } from '@/domain/errors/resource-already-exists';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';

import { generateAccountToRegister } from '@/tests/utils/generate-account-to-register';
import { InMemoryRegisterAccountRepository } from '../../in-memory-repository/register-account-repository';
import { BcryptServiceStub } from './stub/bcrypt-service';

describe('RegisterAccountService', () => {
	let registerAccountRepository: RegisterAccountRepository;

	let bcryptService: BcryptService;
	let sut: RegisterAccountService;

	beforeEach(() => {
		registerAccountRepository = new InMemoryRegisterAccountRepository();

		bcryptService = new BcryptServiceStub();
		sut = new RegisterAccountService(registerAccountRepository, bcryptService);
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('deve lançar ResourceAlreadyExists quando um usuário com o mesmo e-mail já estiver cadastrado', async () => {
		const account = generateAccountToRegister('user');
		registerAccountRepository.register(account);

		await expect(sut.register(account)).rejects.toBeInstanceOf(
			ResourceAlreadyExists,
		);
	});
	it('deve fazer o hash da senha', async () => {
		const account = generateAccountToRegister('user');

		const bcryptServiceSpy = vi
			.spyOn(bcryptService, 'hash')
			.mockResolvedValue('hashedPassword');
		await sut.register(account);
		expect(bcryptServiceSpy).toHaveBeenCalledWith(account.password);
		expect(bcryptServiceSpy).toHaveBeenCalledTimes(1);
	});
});
