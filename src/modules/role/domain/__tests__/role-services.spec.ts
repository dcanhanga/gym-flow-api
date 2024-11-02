import { DomainError } from '@/shared/errors/index.js';
import { ValidRoles } from '@/shared/utils/enums/valid-roles.js';

import { describe, expect, it } from 'vitest';
import { RoleService } from './../role-service.js';

describe('RoleService', () => {
	describe('validateName', () => {
		it('deve retornar sucesso para um nome de role válido', () => {
			const result = RoleService.validateName(ValidRoles.Admin);
			expect(result.isOk()).toBe(true);
		});

		it('deve retornar erro para um nome de role inválido', () => {
			const invalidRole = 'invalidRole';
			const result = RoleService.validateName(invalidRole);
			expect(result.isFail()).toBe(true);
			expect(result.unwrapError()).toBeInstanceOf(DomainError);
			expect(result.unwrapError().message).toBe('Invalid role name provided');
			expect(result.unwrapError().context).toEqual({
				providedName: invalidRole,
				validRoles: RoleService.getValidRoles(),
			});
		});
	});

	describe('validatePermission', () => {
		it('deve retornar sucesso quando a role tiver permissão suficiente', () => {
			const result = RoleService.validatePermission(ValidRoles.Manager);
			expect(result.isOk()).toBe(true);
		});

		it('deve retornar erro quando a role não tiver permissão suficiente', () => {
			const result = RoleService.validatePermission(ValidRoles.Admin);
			expect(result.isFail()).toBe(true);
			expect(result.unwrapError()).toBeInstanceOf(DomainError);
			expect(result.unwrapError().message).toBe(
				'Insufficient permissions to create role',
			);
			expect(result.unwrapError().context).toEqual({
				requiredRole: 'Manager',
				providedRole: ValidRoles.Admin,
			});
		});
	});

	describe('isAdmin', () => {
		it('deve retornar true quando a role for Admin', () => {
			expect(RoleService.isAdmin(ValidRoles.Admin)).toBe(true);
		});

		it('deve retornar false quando a role não for Admin', () => {
			expect(RoleService.isAdmin(ValidRoles.Manager)).toBe(false);
		});
	});

	describe('getValidRoles', () => {
		it('deve retornar uma lista com todas as roles válidas', () => {
			const validRoles = RoleService.getValidRoles();
			expect(validRoles).toContain(ValidRoles.Admin);
			expect(validRoles).toContain(ValidRoles.Manager);
			expect(validRoles).toEqual(Object.values(ValidRoles));
		});
	});
});
