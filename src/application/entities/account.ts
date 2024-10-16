export interface Account {
	id: string;
	name: string;
	email: string;
	password: string;
	avatarUrl: string | null;
	roleId: string;
}
