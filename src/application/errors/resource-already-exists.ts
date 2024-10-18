class ResourceAlreadyExistsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResourceAlreadyExistsError';
	}
}

export { ResourceAlreadyExistsError };
