import { BaseEntity } from '@/shared/domain/entity/base-entity.js';
import { UUID } from '@/shared/domain/value-object/uuid.js';
import type { ValidRole } from '@/shared/utils/enums/valid-roles.js';
import { Result } from '@/shared/utils/result.js';
import { RoleName } from './role-name.js';
import { RoleService } from './role-service.js';

export class Role extends BaseEntity<Role.Params> {
	private id: UUID;
	private name: RoleName;

	private constructor(params: Role.Params) {
		super(params);
		this.id = UUID.create(params.id).unwrap();
		this.name = RoleName.create(params.name).unwrap();
	}

	public static create(params: Role.CreateRole): Result<Role, Error> {
		const permissionValidation = RoleService.validatePermission(
			params.createBy,
		);
		if (permissionValidation.isFail()) {
			return Result.fail(permissionValidation.unwrapError());
		}

		const nameValidation = RoleService.validateName(params.name);
		if (nameValidation.isFail()) {
			return Result.fail(nameValidation.unwrapError());
		}

		return Result.ok(
			new Role({
				name: params.name,
				id: params.id,
			}),
		);
	}
	public getId() {
		return this.id.getValue();
	}
	public getName() {
		return this.name.getValue();
	}
	public getValue() {
		return {
			name: this.getName(),
			id: this.getId(),
		};
	}
}

export namespace Role {
	export type Params = {
		name: ValidRole;
		id?: string;
	};

	export type JSON = {
		id: string;
		name: ValidRole;
	};

	export type CreateRole = {
		createBy: ValidRole;
	} & Params;
}
