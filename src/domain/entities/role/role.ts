import { DomainError, messages } from '@/domain/errors';
import { UUID } from '@/domain/vo';
import { RoleName } from '@/domain/vo/role-name';
import type { ValidRoles } from './protocols';

type Input = {
	name: keyof typeof ValidRoles;
	id?: string;
	isManager: boolean;
};

export class Role {
	private name: RoleName;
	private id: UUID;

	private constructor(input: Input) {
		this.validateManagerPermission(input.isManager);
		this.id = new UUID(input.id);
		this.name = new RoleName(input.name);
		Object.freeze(this);
	}

	getName() {
		return this.name.getValue();
	}
	getId() {
		return this.id.getValue();
	}

	private validateManagerPermission(isManager: boolean) {
		if (!isManager) {
			throw new DomainError(messages.ROLE_MANAGER_PERMISSION_REQUIRED);
		}
	}

	static create(input: Input): Role {
		return new Role(input);
	}
}
