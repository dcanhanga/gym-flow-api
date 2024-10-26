import { randomUUID } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import { ValidRoles } from '@/domain/entities/role';
import { DomainError, messages } from '@/domain/errors';
import { AccountPermissionService } from '@/domain/services/account-permission';

describe('AccountPermissionService', () => {
	test('deve lançar um erro quando o role não for manager e o nome do role for ADMIN', () => {
		expect(() =>
			AccountPermissionService.validate({
				role: { id: randomUUID(), name: ValidRoles.Admin },
				isManager: false,
			}),
		).toThrow(new DomainError(messages.ROLE_MANAGER_PERMISSION_REQUIRED));
	});

	test('deve lançar um erro quando o role não for manager e o nome do role for MANAGER', () => {
		expect(() =>
			AccountPermissionService.validate({
				role: { id: randomUUID(), name: ValidRoles.Manager },
				isManager: false,
			}),
		).toThrow(new DomainError(messages.ROLE_MANAGER_PERMISSION_REQUIRED));
	});

	test('não deve lançar um erro quando o role for manager e o nome do role for ADMIN', () => {
		expect(() =>
			AccountPermissionService.validate({
				role: { id: randomUUID(), name: 'ADMIN' },
				isManager: true,
			}),
		).not.toThrow();
	});

	test('não deve lançar um erro quando o role for manager e o nome do role for MANAGER', () => {
		expect(() =>
			AccountPermissionService.validate({
				role: { id: randomUUID(), name: 'MANAGER' },
				isManager: true,
			}),
		).not.toThrow();
	});

	test('não deve lançar um erro para roles sem permissões de gerência (exemplo: USER)', () => {
		expect(() =>
			AccountPermissionService.validate({
				role: { id: randomUUID(), name: 'USER' },
				isManager: false,
			}),
		).not.toThrow();
	});
});
