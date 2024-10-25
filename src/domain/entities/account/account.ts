import type { RoleDto } from '@/domain/dto/role';
import { AccountPermissionService } from './services/account-permission';
import { Email } from './vo/email';
import { Name } from './vo/name';
import { Password } from './vo/password';
import { Url } from './vo/url';
import { UUID } from './vo/uuid';
type Input = {
	email: string;
	name: string;
	password: string;
	avatarUrl: string | null;
	role: RoleDto;
	isManager: boolean;
};

class Account {
	private password: Password;
	private email: Email;
	private name: Name;
	private roleId: UUID;
	private id: UUID;
	private avatarUrl: Url;

	private constructor(input: Input) {
		this.email = new Email(input.email);
		this.name = new Name(input.name);
		this.id = new UUID();
		this.roleId = new UUID(input.role.id);
		this.password = new Password(input.password);
		this.avatarUrl = new Url(input.avatarUrl);
		Object.freeze(this);
	}

	getName() {
		return this.name.getValue();
	}
	getEmail() {
		return this.email.getValue();
	}
	getPassword() {
		return this.password.getValue();
	}
	getRoleId() {
		return this.roleId.getValue();
	}
	getAvatarUrl() {
		return this.avatarUrl.getValue();
	}
	getId() {
		return this.id.getValue();
	}
	getUrl() {
		return this.avatarUrl.getValue();
	}

	static create(input: Input): Account {
		AccountPermissionService.validate(input.role, input.isManager);
		return new Account(input);
	}
}
export { Account };
