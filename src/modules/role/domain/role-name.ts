import { ValueObject } from '@/shared/domain/value-object/value-object.js';
import { InvalidRoleError } from '@/shared/errors/domain.error.js';
import { ValidRoles } from '@/shared/utils/enums/valid-roles.js';
import { Result } from '@/shared/utils/result.js';

type Name = keyof typeof ValidRoles;
type RoleNameProps = {
	value: Name;
};

const roles = Object.values(ValidRoles) as Name[];
export class RoleName extends ValueObject<RoleNameProps> {
	private constructor(props: RoleNameProps) {
		super(props);
	}
	public static create(name: Name) {
		if (!RoleName.validate(name)) {
			return Result.fail(new InvalidRoleError(name));
		}
		return Result.ok(new RoleName({ value: name }));
	}
	private static validate(name: Name): boolean {
		return roles.includes(name);
	}
	public getValue(): string {
		return this.props.value;
	}
}
