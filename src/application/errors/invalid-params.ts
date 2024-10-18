class InvalidParamsError extends Error {
	errors: Record<string, string>;
	constructor(message: string, errors: Record<string, string>) {
		super(message);
		this.name = 'InvalidParamsError';
		this.errors = errors;
	}
}

export { InvalidParamsError };
