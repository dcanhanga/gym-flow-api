import { InvalidParametersError, NoChangesError } from '@/domain/errors';
import type { ErrorResponse } from '@/domain/errors/error-response';
import { messages } from '@/domain/errors/message';

import type { Validator } from './validator';

enum ValidRoles {
	ADMIN = 'ADMIN',
	MANAGER = 'MANAGER',
	CLIENT = 'CLIENT',
}
type UpdateParams = {
	newRole: { name: string };
	oldRole: { id: string; name: string };
};
type RoleParams = {
	name: string;
	id?: string;
};

class Role {
	private constructor(private readonly params: RoleParams) {
		Object.freeze(this);
	}

	getName(): string {
		return this.params.name;
	}

	getId() {
		return this.params.id;
	}

	static create(params: RoleParams, validator: Validator): Role {
		const result = validator.validate(params);
		return Role.validateOrThrow(result);
	}

	static update(params: UpdateParams, validator: Validator): Role {
		const { newRole, oldRole } = params;
		const updates: Partial<RoleParams> = {};
		let hasChanges = false;
		for (const key in oldRole) {
			if (key === 'id') {
				updates[key] = oldRole.id;
				continue;
			}
			if (key === 'name' && oldRole.name !== newRole.name) {
				updates.name = newRole.name;
				hasChanges = true;
			}
		}
		if (!hasChanges) {
			throw new NoChangesError('Não há mudanças suficientes para atualizar.');
		}
		const result = validator.validate(updates);
		return Role.validateOrThrow(result);
	}

	private static validateOrThrow(result: RoleParams | ErrorResponse) {
		if ('errors' in result) {
			throw new InvalidParametersError(
				messages.INVALID_INPUT_PARAMETERS,
				result.errors,
			);
		}
		return new Role({
			name: result.name,
			id: result.id,
		});
	}
}
export { Role, ValidRoles };
