import { describe, expect, it } from 'vitest';

import { UUID } from '@/shared/domain/value-object/uuid.js';
import { DomainError } from '@/shared/errors/index.js';
import { ValidRoles } from '@/shared/utils/enums/valid-roles.js';
import { uuidRegex } from '@/shared/utils/regex.js';
import { Role } from '../entity.js';

describe('Role', () => {
	describe('create', () => {
		it('deve criar uma instância de Role válida quando os parâmetros são válidos', () => {
			const role = Role.create({
				name: ValidRoles.Admin,
				id: UUID.create().unwrap().getValue(),
				createBy: ValidRoles.Manager,
			});

			expect(role.isOk()).toBe(true);
			const createdRole = role.unwrap();
			expect(createdRole.getName()).toBe(ValidRoles.Admin);
			expect(createdRole.getId()).toMatch(uuidRegex);
		});

		it('deve criar uma instância de Role válida e gerar um ID automaticamente quando não for fornecido', () => {
			const role = Role.create({
				name: ValidRoles.Admin,
				createBy: ValidRoles.Manager,
			});

			expect(role.isOk()).toBe(true);
			const createdRole = role.unwrap();
			expect(createdRole.getName()).toBe(ValidRoles.Admin);
			expect(createdRole.getId()).toBeDefined();
		});

		it('deve retornar erro quando as permissões de criação são insuficientes', () => {
			const role = Role.create({
				name: ValidRoles.Admin,
				id: UUID.create().unwrap().getValue(),
				createBy: ValidRoles.Admin,
			});

			expect(role.isFail()).toBe(true);
			expect(role.unwrapError()).toBeInstanceOf(DomainError);
			expect(role.unwrapError().message).toBe(
				'Insufficient permissions to create role',
			);
		});

		it('deve retornar erro para um nome de role inválido', () => {
			const invalidRoleName = 'invalidRole';
			const role = Role.create({
				name: invalidRoleName as ValidRoles,
				id: UUID.create().unwrap().getValue(),
				createBy: ValidRoles.Manager,
			});

			expect(role.isFail()).toBe(true);
			expect(role.unwrapError()).toBeInstanceOf(DomainError);
			expect(role.unwrapError().message).toBe('Invalid role name provided');
		});
	});

	describe('getId', () => {
		it('deve retornar o ID da role', () => {
			const id = UUID.create().unwrap().getValue();
			const role = Role.create({
				name: ValidRoles.Admin,
				id,
				createBy: ValidRoles.Manager,
			}).unwrap();

			expect(role.getId()).toBe(id);
		});
	});

	describe('getName', () => {
		it('deve retornar o nome da role', () => {
			const role = Role.create({
				name: ValidRoles.Admin,
				id: UUID.create().unwrap().getValue(),
				createBy: ValidRoles.Manager,
			}).unwrap();

			expect(role.getName()).toBe(ValidRoles.Admin);
		});
	});

	describe('getValue', () => {
		it('deve retornar um objeto com o ID e o nome da role', () => {
			const id = UUID.create().unwrap().getValue();
			const role = Role.create({
				name: ValidRoles.Admin,
				id,
				createBy: ValidRoles.Manager,
			}).unwrap();

			expect(role.getValue()).toEqual({
				id,
				name: ValidRoles.Admin,
			});
		});
	});
});
