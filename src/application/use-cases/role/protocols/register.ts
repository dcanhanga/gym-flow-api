type Params = {
	name: string;
};
interface RegisterRole {
	register(params: Params): Promise<void>;
}

export type { Params, RegisterRole };
