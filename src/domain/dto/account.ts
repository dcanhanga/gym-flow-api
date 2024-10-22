type AccountDto = {
	id: string;
	name: string;
	email: string;
	password: string;
	avatarUrl: string | null;
	roleId: string;
};
type CreateAccountDto = {
	name: string;
	email: string;
	password: string;
	roleId: string;
};
type CreateAccountValidationResultDto = {
	name: string;
	email: string;
	password: string;
};

export type { AccountDto, CreateAccountDto, CreateAccountValidationResultDto };
