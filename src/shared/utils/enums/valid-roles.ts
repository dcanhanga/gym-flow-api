export enum ValidRoles {
	Admin = 'Admin',
	Manager = 'Manager',
	Client = 'Client',
}
export type ValidRole = keyof typeof ValidRoles;
