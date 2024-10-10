class ResourceAlreadyExists extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResourceAlreadyExists';
	}
}

export { ResourceAlreadyExists };
