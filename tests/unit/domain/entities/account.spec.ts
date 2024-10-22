import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { Account } from '@/domain/entities/account';
import { InvalidParametersError } from '@/domain/errors';
import { ZodAccountValidator } from '@/infrastructure/validators/zod/account';

describe('Account - entidade', () => {
	const zodAccountValidator = new ZodAccountValidator();

	const invalidData = [
		{
			email: '',
			name: 'Teste da Silvia',
			password: 'validPassword@1',
			roleId: randomUUID(),
		},
		{
			email: 'teste@gmail.com',
			name: 'Teste da Silvia',
			password: 'validPassword1',
			roleId: randomUUID(),
		},
		{
			email: 'teste@gmail.com',
			name: '',
			password: 'validPassword@1',
			roleId: randomUUID(),
		},
	];

	it('deve criar um conta válida com dados corretos', () => {
		const validData = {
			email: 'teste@gmail.com',
			name: 'Teste da Silvia',
			password: 'validPassword@1',
			roleId: randomUUID(),
		} as const;

		expect(Account.create(validData, zodAccountValidator).getName()).toBe(
			validData.name,
		);
	});

	it.each(invalidData)(
		'deve lançar um erro ao fornecer dados inválidos: %s',
		(data) => {
			expect(() => Account.create(data, zodAccountValidator)).toThrow(
				InvalidParametersError,
			);
		},
	);

	it('deve lançar um erro quando o roleId fornecido for inválido', () => {
		const invalidData = {
			email: 'teste@gmail.com',
			name: 'Teste da Silvia',
			password: 'validPassword@1',
			roleId: '',
		} as const;

		expect(() => Account.create(invalidData, zodAccountValidator)).toThrow(
			Error('ID provided by database is invalid uuid'),
		);
	});
});
