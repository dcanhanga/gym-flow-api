// import { NoChangesError } from '@/domain/errors';
// import { messages } from '@/domain/errors/message';
// import type { Params, UpdateParams, ValidRoles, Validator } from './protocols';
// import { RoleUtils } from './utils';

// class Role {
// 	private constructor(private readonly params: Params) {
// 		Object.freeze(this);
// 	}

// 	getName(): ValidRoles {
// 		RoleUtils.validateRoleName(this.params.name);
// 		return this.params.name as ValidRoles;
// 	}

// 	getId() {
// 		return this.params.id;
// 	}

// 	static create(createParams: Params, validator: Validator): Role {
// 		const result = validator.validateCreate(createParams);
// 		return Role.generateRole(result);
// 	}

// 	static update(updateParams: UpdateParams, validator: Validator): Role {
// 		const { newRole, oldRole } = updateParams;
// 		const updates: Partial<Params> = {};
// 		const result = validator.validateUpdate(newRole);
// 		const ignoredKeys = new Set(['id']);
// 		const hasChanges = RoleUtils.processUpdates(
// 			oldRole,
// 			result,
// 			updates,
// 			ignoredKeys,
// 		);

// 		if (!hasChanges) {
// 			throw new NoChangesError(messages.THERE_ARE_NOT_ENOUGH_CHANGES_TO_UPDATE);
// 		}

// 		return Role.generateRole({ name: result.name, id: oldRole.id });
// 	}

// 	private static generateRole(params: Params) {
// 		return new Role({
// 			name: params.name,
// 			id: params.id,
// 		});
// 	}
// }
// export { Role, type ValidRoles };
