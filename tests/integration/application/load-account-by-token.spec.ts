import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ForbiddenError } from '@/application/errors/forbidden';
import { messages } from '@/application/errors/message';
import { UnauthorizedError } from '@/application/errors/unauthorized';
import { LoadAccountByTokenUseCase } from '@/application/use-cases/load-account-by-token';
import { JWTAdapter } from '@/infrastructure/auth/jwt-adapter';
import { ZodLoadAccountByTokenValidator } from '@/infrastructure/validators/zod/token-validator';
import { InMemoryAccountRepository } from '../in-memory-repository/account-repository';
import { InMemoryRoleRepository } from '../in-memory-repository/role-repository';

describe('LoadAccountByTokenUseCase - teste de integração', () => {
	type InitTypes = {
		sut: LoadAccountByTokenUseCase;
		roleRepository: InMemoryRoleRepository;
		accountRepository: InMemoryAccountRepository;
		tokenGenerator: JWTAdapter;
	};
	let setup: InitTypes;
	function init(): InitTypes {
		const accountRepository = new InMemoryAccountRepository();
		const roleRepository = new InMemoryRoleRepository();
		const tokenGenerator = new JWTAdapter(
			'LoadAccountByTokenUseCase - teste de integração',
		);
		const tokenValidator = new ZodLoadAccountByTokenValidator();
		const sut = new LoadAccountByTokenUseCase(
			accountRepository,
			roleRepository,
			tokenGenerator,
			tokenValidator,
			['ADMIN', 'MANAGER'],
		);
		return { sut, roleRepository, accountRepository, tokenGenerator };
	}

	beforeEach(() => {
		setup = init();
	});

	afterEach(() => {
		setup.accountRepository.clear();
		setup.roleRepository.clear();
	});

	describe('casos de erro', () => {
		it('lançar erro se o token for invalido ', async () => {
			const { sut } = setup;
			await expect(sut.load({ token: '' })).rejects.toStrictEqual(
				new UnauthorizedError(messages.ACESSES_DENIED),
			);
		});

		it('Lançar erro se o token for válido, mas for assinado com uma chave secreta diferente da utilizada pelo servidor', async () => {
			const token =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
			const { sut } = setup;
			await expect(sut.load({ token })).rejects.toStrictEqual(
				new UnauthorizedError(messages.ACESSES_DENIED),
			);
		});

		it('lançar erro se o usuário não for encontrado', async () => {
			const { sut, tokenGenerator } = setup;
			const token = tokenGenerator.generateToken(
				{
					userId: 'invalid_user_id',
				},
				'15m',
			);
			await expect(sut.load({ token })).rejects.toStrictEqual(
				new UnauthorizedError(messages.ACESSES_DENIED),
			);
		});

		it('lançar erro se o usuário não tiver permissões suficientes', async () => {
			const { sut, roleRepository, accountRepository, tokenGenerator } = setup;

			const role = await roleRepository.register('USER');
			const account = await accountRepository.register({
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'passworD@123',
				roleId: role.id,
			});
			const token = tokenGenerator.generateToken({ userId: account.id }, '15m');
			await expect(sut.load({ token })).rejects.toStrictEqual(
				new ForbiddenError(messages.ACESSES_DENIED),
			);
		});
	});

	describe('casos de sucesso', () => {
		it('deve carregar a conta se o token for válido e o usuário tiver permissões', async () => {
			const { sut, roleRepository, accountRepository, tokenGenerator } = setup;

			const role = await roleRepository.register('ADMIN');
			const account = await accountRepository.register({
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: 'passworD@123',
				roleId: role.id,
			});
			const token = tokenGenerator.generateToken({ userId: account.id }, '15m');

			// Carrega a conta e verifica o sucesso
			const result = await sut.load({ token });
			expect(result).toStrictEqual(account);
		});
	});
});
