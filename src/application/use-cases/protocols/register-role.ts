export interface RegisterRole {
	register(params: RegisterRole.Params): Promise<RegisterRole.Result>;
}

export namespace RegisterRole {
	export type Params = {
		name: string;
		accountId: string;
	};
	export type Result = {
		id: string;
		name: string;
	};
}
