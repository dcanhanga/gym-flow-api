import { DomainError, messages } from '@/domain/errors';
import { ValidRoles } from '../entities/role';

type Name = keyof typeof ValidRoles;
const roles = Object.values(ValidRoles) as Name[];
export class RoleName {
	private value: keyof typeof ValidRoles;

	constructor(value: string) {
		if (!roles.includes(value as Name)) {
			throw new DomainError(messages.INVALID_ROLE_NAME);
		}
		this.value = value as Name;
	}

	getValue() {
		return this.value;
	}
}
