import type { CreateAccountDto } from '@/domain/dto/account';
import { InvalidParametersError, NoChangesError } from '@/domain/errors';
import { messages } from '@/domain/errors/message';
import { ZodAccountValidator } from '@/infrastructure/validators/zod/account';
import type {
	NewParams,
	OldParams,
	Params,
	UpdateParams,
	Validator,
} from './protocols';

class Account {
	private constructor(private readonly params: Params) {
		Object.freeze(this);
	}

	getName() {
		return this.params.name;
	}
	getEmail() {
		return this.params.email;
	}
	getPassword() {
		return this.params.password;
	}
	getRoleId() {
		return this.params.roleId;
	}
	getAvatarUrl() {
		return this.params.avatarUrl;
	}
	getId() {
		return this.params.id;
	}

	static create(createParams: CreateAccountDto, validator: Validator): Account {
		const { roleId, ...accountDataToValidate } = createParams;
		validator.roleId(roleId);
		const result = validator.create(accountDataToValidate);
		return Account.generateAccount({ ...result, avatarUrl: null, roleId });
	}

	private static generateAccount(params: Params) {
		return new Account(params);
	}
}
export { Account };
