import { afterEach, describe, expect, it, vi } from 'vitest';

import { ForbiddenError } from '@/application/errors/forbidden';
import { UnauthorizedError } from '@/application/errors/unauthorized';
import { LoadAccountByTokenUseCase } from '@/application/use-cases/load-account-by-token';

import { StubTokenGenerator } from '../stub/cryptography/generate-token';
import { StubAccountRepository } from '../stub/repositories/account-repository';
import { StubRoleRepository } from '../stub/repositories/role-repository';
import { StubTokenValidator } from '../stub/validators/token-validator';
const permittedRoles = [
	{ roleName: 'CLIENT', permittedRoles: undefined },
	{ roleName: 'ADMIN', permittedRoles: ['ADMIN', 'MANAGER'] },
	{ roleName: 'MANAGER', permittedRoles: ['ADMIN', 'MANAGER', 'CLIENT'] },
];
describe('Caso de uso: LoadAccountByTokenUseCase - teste unitário', () => {
	function setup(permittedRoles?: string[]) {
		const accountRepository = new StubAccountRepository();
		const roleRepository = new StubRoleRepository();
		const tokenGenerator = new StubTokenGenerator();
		const tokenValidator = new StubTokenValidator();
		const sut = new LoadAccountByTokenUseCase(
			accountRepository,
			roleRepository,
			tokenGenerator,
			tokenValidator,
			permittedRoles,
		);
		return {
			sut,
			accountRepository,
			roleRepository,
			tokenGenerator,
			tokenValidator,
		};
	}

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('caso de erros', () => {
		it('deve lançar UnauthorizedError se accessToken não for uma string válida', async () => {
			const { sut, tokenValidator } = setup(['MANAGER']);
			const tokenError = {
				errors: {
					accessToken: 'invalid_token',
				},
			};
			vi.spyOn(tokenValidator, 'validate').mockReturnValue(tokenError);
			await expect(sut.load({ token: '' })).rejects.toThrow(UnauthorizedError);
		});

		it('deve lançar UnauthorizedError se accessToken for inválido', async () => {
			const { sut, tokenGenerator } = setup();
			vi.spyOn(tokenGenerator, 'verifyToken').mockReturnValue(null);
			await expect(sut.load({ token: 'invalid_token' })).rejects.toThrow(
				UnauthorizedError,
			);
		});

		it('deve lançar UnauthorizedError se a conta não for encontrada', async () => {
			const { sut, accountRepository } = setup();
			vi.spyOn(accountRepository, 'findById').mockResolvedValue(null);
			await expect(sut.load({ token: 'any_token' })).rejects.toThrow(
				UnauthorizedError,
			);
		});

		it('deve lançar ForbiddenError se o papel da conta não estiver na lista de papéis permitidos', async () => {
			const { sut, roleRepository } = setup(['MANAGER', 'ADMIN']);
			vi.spyOn(roleRepository, 'findById').mockResolvedValue({
				id: 'admin_role_id',
				name: 'CLIENT',
			});
			await expect(sut.load({ token: 'valid_token' })).rejects.toThrow(
				ForbiddenError,
			);
		});
		it('deve propagar um erro se o accountRepository lançar um erro', async () => {
			const { sut, accountRepository } = setup();
			vi.spyOn(accountRepository, 'findById').mockRejectedValue(
				new Error('any_error'),
			);
			await expect(sut.load({ token: 'any_token' })).rejects.toThrow(Error);
		});
	});

	describe('caso de sucesso', () => {
		it.each(permittedRoles)(
			'deve retornar a conta se o papel da conta for $roleName e estiver na lista de papéis permitidos',
			async ({ roleName, permittedRoles }) => {
				const { sut, roleRepository } = setup(permittedRoles);

				vi.spyOn(roleRepository, 'findById').mockResolvedValue({
					id: `${roleName.toLowerCase()}_role_id`,
					name: roleName,
				});

				const account = await sut.load({ token: 'any_token' });
				expect(account).toBeDefined();
			},
		);
	});
});
