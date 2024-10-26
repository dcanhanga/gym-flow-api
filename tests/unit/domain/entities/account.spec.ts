import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { Account } from '@/domain/entities';
import { ValidRoles } from '@/domain/entities/role';
import { DomainError } from '@/domain/errors';

describe('Account - Entidade', () => {
	const input = {
		email: 'teste@gmail.com',
		name: 'Teste Canhanga',
		password: '1111111111@A',
		isManager: false,
		role: {
			id: randomUUID(),
			name: ValidRoles.Client,
		},
	};

	describe('Caso de Sucesso', () => {
		it('deve criar uma nova conta para um usuário comum (CLIENT)', () => {
			const account = Account.create(input);
			expect(account).toBeInstanceOf(Account);
		});

		it('deve criar uma nova conta com permissões de administrador (ADMIN)', () => {
			const adminAccountInput = {
				...input,
				isManager: true,
				role: {
					id: randomUUID(),
					name: ValidRoles.Admin,
				},
			};
			const adminAccount = Account.create(adminAccountInput);
			expect(adminAccount).toBeInstanceOf(Account);
		});

		it('deve retornar o nome correto usando getName()', () => {
			const account = Account.create(input);
			expect(account.getName()).toBe(input.name);
		});

		it('deve retornar o email correto usando getEmail()', () => {
			const account = Account.create(input);
			expect(account.getEmail()).toBe(input.email);
		});

		it('deve retornar o password correto usando getPassword()', () => {
			const account = Account.create(input);
			expect(account.getPassword()).toBe(input.password);
		});

		it('deve retornar o roleId correto usando getRoleId()', () => {
			const account = Account.create(input);
			expect(account.getRoleId()).toBe(input.role.id);
		});

		it('deve retornar o avatarUrl correto usando getAvatarUrl()', () => {
			const account = Account.create(input);
			expect(account.getAvatarUrl()).toBeNull();
		});

		it('deve retornar o id correto usando getId()', () => {
			const account = Account.create(input);
			expect(account.getId()).toBeTypeOf('string');
		});

		it('deve retornar o URL correto usando getUrl()', () => {
			const account = Account.create(input);
			expect(account.getUrl()).toBeNull();
		});
	});

	describe('Caso de Falha', () => {
		it('não deve criar uma nova conta com email inválido', () => {
			const invalidEmailInput = {
				...input,
				email: 'invalid-email',
			};
			expect(() => Account.create(invalidEmailInput)).toThrowError(DomainError);
		});

		it('não deve criar uma nova conta com senha inválida', () => {
			const invalidPasswordInput = {
				...input,
				password: 'invalid-password',
			};
			expect(() => Account.create(invalidPasswordInput)).toThrowError(
				DomainError,
			);
		});

		it('não deve permitir criar uma conta de administrador com role diferente de MANAGER', () => {
			const unauthorizedRoleInput = {
				...input,
				isManager: false,
				role: {
					id: randomUUID(),
					name: ValidRoles.Manager,
				},
			};
			expect(() => Account.create(unauthorizedRoleInput)).toThrowError(
				DomainError,
			);
		});
	});
});
