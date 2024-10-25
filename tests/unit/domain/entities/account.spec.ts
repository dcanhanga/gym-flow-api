import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { Account } from '@/domain/entities';
import { AccessForbiddenError, InvalidParametersError } from '@/domain/errors';

describe('Account - entidade', () => {
	describe('Caso de Sucessos', () => {
		it('deve criar uma nova conta com sucesso', () => {
			const account = Account.create({
				avatarUrl: null,
				email: 'teste@gmail.com',
				name: 'Teste Canhanga',
				password: '1111111111@A',
				isManager: false,
				role: {
					id: randomUUID(),
					name: 'CLIENT',
				},
			});
			expect(account).toBeInstanceOf(Account);
		});
		it('deve criar uma nova conta uma conta administrador', () => {
			const input = {
				avatarUrl: null,
				email: 'teste@gmail.com',
				name: 'Teste Canhanga',
				password: '1111111111@A',
				isManager: true,
				role: {
					id: randomUUID(),
					name: 'ADMIN',
				},
			};
			const account = Account.create(input);
			expect(account).toBeInstanceOf(Account);
		});
		it('não deve criar uma nova conta com email invalido', () => {
			const input = {
				avatarUrl: null,
				email: 'invalid-email',
				name: 'Teste Canhanga',
				password: '1111111111@A',
				isManager: true,
				role: {
					id: randomUUID(),
					name: 'ADMIN',
				},
			};
			expect(() => Account.create(input)).toThrowError(InvalidParametersError);
		});
		it('não deve criar uma nova conta com senha invalida', () => {
			const input = {
				avatarUrl: null,
				email: 'teste@gmail.com',
				name: 'Teste Canhanga',
				password: 'invalid-password',
				isManager: true,
				role: {
					id: randomUUID(),
					name: 'ADMIN',
				},
			};
			expect(() => Account.create(input)).toThrowError(InvalidParametersError);
		});
		it('não deve criar uma conta se administrador se o role for diferente MANAGER ou ADMIN', () => {
			const input = {
				avatarUrl: null,
				email: 'teste@gmail.com',
				name: 'Teste Canhanga',
				password: '1111111111@A',
				isManager: false,
				role: {
					id: randomUUID(),
					name: 'MANAGER',
				},
			};
			expect(() => Account.create(input)).toThrowError(AccessForbiddenError);
		});
	});
});
