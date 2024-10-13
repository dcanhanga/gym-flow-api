class InvalidParams extends Error {
	errors: Record<string, string>;
	constructor(message: string, errors: Record<string, string>) {
		super(message);
		this.name = 'InvalidParams';
		this.errors = errors;
	}
}

export { InvalidParams };
