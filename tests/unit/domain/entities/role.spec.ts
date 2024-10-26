import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { Role, type ValidRoles } from '@/domain/entities/role';
import { DomainError } from '@/domain/errors';

describe('Role - Entidade', () => {
	const validInput = {
		name: 'Admin' as keyof typeof ValidRoles,
		id: randomUUID(),
		isManager: true,
	};

	describe('Caso de Sucesso', () => {
		it('deve criar uma nova instância de Role quando as entradas são válidas e o usuário é manager', () => {
			const role = Role.create(validInput);
			expect(role).toBeInstanceOf(Role);
			expect(role.getName()).toBe(validInput.name);
			expect(role.getId()).toBe(validInput.id);
		});
		it('deve gerar um novo UUID se nenhum ID for passado', () => {
			const inputWithoutId = { ...validInput, id: undefined };
			const role = Role.create(inputWithoutId);
			expect(role.getId()).toBeTypeOf('string');
			expect(role.getId()).not.toBe('');
		});
	});

	describe('Caso de Falha', () => {
		it('deve lançar um erro quando o usuário não tiver permissão de manager', () => {
			const invalidInput = { ...validInput, isManager: false };
			expect(() => Role.create(invalidInput)).toThrowError(
				new DomainError('ROLE_MANAGER_PERMISSION_REQUIRED'),
			);
		});

		it('deve lançar um erro ao tentar criar uma Role com nome inválido', () => {
			const invalidRoleNameInput = {
				...validInput,
				name: 'InvalidRole' as keyof typeof ValidRoles,
			};
			expect(() => Role.create(invalidRoleNameInput)).toThrowError(
				new DomainError('INVALID_ROLE_NAME'),
			);
		});
	});
});
