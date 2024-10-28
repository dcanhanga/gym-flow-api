import { DomainError, messages } from '@/domain/errors';
import { UUID } from '@/domain/vo';
import { RoleName } from '@/domain/vo/role-name';

export class Role {
	private readonly name: RoleName;
	private readonly id: UUID;

	private constructor(params: Role.Params) {
		this.validateManagerPermission(params.isManager);
		this.id = new UUID(params.id);
		this.name = new RoleName(params.name);
		Object.freeze(this);
	}

	getName() {
		return this.name.getValue();
	}
	getId() {
		return this.id.getValue();
	}

	private validateManagerPermission(isManager: Role.Params['isManager']) {
		if (!isManager) {
			throw new DomainError(messages.ROLE_MANAGER_PERMISSION_REQUIRED);
		}
	}

	static create(params: Role.Params): Role {
		return new Role(params);
	}
}
export namespace Role {
	export enum ValidRoles {
		Admin = 'Admin',
		Manager = 'Manager',
		Client = 'Client',
	}
	export type Params = {
		name: keyof typeof ValidRoles;
		id?: string;
		isManager: boolean;
	};
}
