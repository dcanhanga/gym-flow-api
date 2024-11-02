import { messages } from '@/shared/utils/messages.js';
import { describe, expect, it } from 'vitest';
import { RoleName } from './../role-name.js';

describe('RoleName Value Object', () => {
	const validRoles = ['Admin', 'Manager', 'Client'] as const;

	describe('Criação de RoleName', () => {
		it.each(validRoles)('deve criar um RoleName válido com %s', (role) => {
			const RoleNameResult = RoleName.create(role);
			expect(RoleNameResult.isOk()).toBe(true);
			expect(RoleNameResult.unwrap().getValue()).toEqual(role);
		});

		it('deve falhar ao criar um RoleName com um valor inválido', () => {
			const invalidRole = 'invalid-role';
			// @ts-ignore
			const roleNameResult = RoleName.create(invalidRole);

			expect(roleNameResult.isFail()).toBe(true);
			expect(roleNameResult.unwrapError().message).toBe(
				messages.INVALID_ROLE_NAME,
			);
		});
	});

	// Testes de comparação
	describe('Comparação de RoleNames', () => {
		it('deve retornar true para RoleNames iguais', () => {
			const roleName1Result = RoleName.create('Admin');
			const roleName2Result = RoleName.create('Admin');
			const areEqual = roleName1Result
				.unwrap()
				.equals(roleName2Result.unwrap());

			expect(areEqual).toBe(true);
		});

		it('deve retornar false para RoleNames diferentes', () => {
			const roleName1Result = RoleName.create('Admin');
			const roleName2Result = RoleName.create('Client');
			const areDifferent = roleName1Result
				.unwrap()
				.equals(roleName2Result.unwrap());

			expect(areDifferent).toBe(false);
		});
	});
});
