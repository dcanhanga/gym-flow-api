import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/utils/messages.js';
import { RoleName } from './../role-name.js';

describe('RoleName Value Object', () => {
	const validRoles = ['Admin', 'Manager', 'Client'] as const;

	describe('Casos de Sucesso', () => {
		it.each(validRoles)('deve criar um Role name válido com %s', (role) => {
			const RoleNameResult = RoleName.create(role);
			expect(RoleNameResult.isOk()).toBe(true);
			expect(RoleNameResult.unwrap().getValue()).toEqual(role);
		});

		it('deve comparar dois Role names iguais corretamente', () => {
			const roleName1Result = RoleName.create('Admin');
			const roleName2Result = RoleName.create('Admin');
			const areEqual = roleName1Result
				.unwrap()
				.equals(roleName2Result.unwrap());

			expect(areEqual).toBe(true);
		});

		it('deve comparar dois Role names diferentes corretamente', () => {
			const roleName1Result = RoleName.create('Admin');
			const roleName2Result = RoleName.create('Client');
			const areDifferent = roleName1Result
				.unwrap()
				.equals(roleName2Result.unwrap());

			expect(areDifferent).toBe(false);
		});
	});

	describe('Casos de Erro', () => {
		it('deve falhar ao criar um role name com parâmetro inválido', () => {
			const invalidRole = 'invalid-role';
			// @ts-ignore
			const roleNameResult = RoleName.create(invalidRole);

			expect(roleNameResult.isFail()).toBe(true);
			expect(roleNameResult.unwrapError().message).toBe(
				messages.INVALID_ROLE_NAME,
			);
		});
	});
});
