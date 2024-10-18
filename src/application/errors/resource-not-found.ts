class ResourceNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResourceNotFoundError';
	}
}

export { ResourceNotFoundError };
