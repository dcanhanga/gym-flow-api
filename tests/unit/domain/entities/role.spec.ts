import { describe, expect, it } from 'vitest';

import { Role, ValidRoles } from '@/domain/entities/role';
import { InvalidParametersError, NoChangesError } from '@/domain/errors';
import { ZodRoleValidator } from '@/infrastructure/validators/zod/role';

describe('Role - entidade', () => {
	const zodRoleValidator = new ZodRoleValidator();
	const VALID_ROLES = ['ADMIN', 'MANAGER', 'CLIENT'] as const;
	it.each(VALID_ROLES)('deve criar um role válido com %s', (role) => {
		expect(
			Role.create({ name: ValidRoles[role] }, zodRoleValidator).getName(),
		).toBe(role);
	});
	it('deve criar um role válido com um UUID válido', () => {
		const validUUID = '123e4567-e89b-12d3-a456-426614174000';
		const input = { name: ValidRoles.ADMIN, id: validUUID };

		expect(Role.create(input, zodRoleValidator).getId()).toBe(validUUID);
	});

	it('deve atualizar o role name', () => {
		const role = Role.create({ name: ValidRoles.ADMIN }, zodRoleValidator);
		const input = {
			newRole: { name: ValidRoles.MANAGER },
			oldRole: { id: role.getId() as string, name: role.getName() },
		};
		const result = Role.update(input, zodRoleValidator);
		expect(result.getName()).toBe(ValidRoles.MANAGER);
		expect(result.getId()).toBe(role.getId());
	});

	it('deve lançar um erro caso o role name seja inválido', () => {
		expect(() => Role.create({ name: 'admin' }, zodRoleValidator)).throw(
			InvalidParametersError,
		);
	});
	it('deve lançar um erro caso o UUID seja inválido', () => {
		expect(() =>
			Role.create(
				{ id: 'invalid-uuid', name: ValidRoles['ADMIN'] },
				zodRoleValidator,
			),
		).throw(InvalidParametersError);
	});
	it('deve lançar erro ao atualizar o role se o nome para atualizar for igual ao atual', () => {
		const role = Role.create({ name: ValidRoles.ADMIN }, zodRoleValidator);
		const input = {
			newRole: { name: ValidRoles.ADMIN },
			oldRole: { id: role.getId() as string, name: role.getName() },
		};

		expect(() => Role.update(input, zodRoleValidator)).toThrow(NoChangesError);
	});
});
