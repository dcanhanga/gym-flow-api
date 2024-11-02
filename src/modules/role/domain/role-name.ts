import { ValueObject } from '@/shared/domain/value-object/value-object.js';
import { InvalidRoleError } from '@/shared/errors/domain.error.js';
import {
	type ValidRole,
	ValidRoles,
} from '@/shared/utils/enums/valid-roles.js';
import { Result } from '@/shared/utils/result.js';

type RoleNameProps = {
	value: ValidRole;
};

const roles = Object.values(ValidRoles) as ValidRole[];
export class RoleName extends ValueObject<RoleNameProps> {
	private constructor(props: RoleNameProps) {
		super(props);
	}
	public static create(name: ValidRole): Result<RoleName, Error> {
		if (!RoleName.validate(name)) {
			return Result.fail(new InvalidRoleError(name));
		}
		return Result.ok(new RoleName({ value: name }));
	}
	private static validate(name: ValidRole): boolean {
		return roles.includes(name);
	}
	public getValue(): ValidRole {
		return this.props.value;
	}
}
