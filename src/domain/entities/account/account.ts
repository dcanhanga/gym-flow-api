import type { AccountEntityCreationDto } from '@/domain/dto/account';
import type { RoleDto } from '@/domain/dto/role';
import { AccountPermissionService } from '@/domain/services/account-permission';
import { Email, Name, Password, UUID, Url } from '@/domain/vo';

type Input = {
	id?: string;
	email: string;
	name: string;
	password: string;
	avatarUrl: string | null;
	role: RoleDto;
	isManager: boolean;
};

class Account {
	private readonly password: Password;
	private readonly email: Email;
	private readonly name: Name;
	private readonly roleId: UUID;
	private readonly id: UUID;
	private readonly avatarUrl: Url;

	private constructor(input: Input) {
		this.email = new Email(input.email);
		this.name = new Name(input.name);
		this.id = new UUID(input.id);
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

	static create(input: AccountEntityCreationDto): Account {
		const { role, isManager } = input;
		AccountPermissionService.validate({ isManager, role });
		return new Account({ ...input, avatarUrl: null });
	}
}
export { Account };
