type KeyValue = Record<string, string>;

class InvalidParams extends Error {
	errors: KeyValue;
	constructor(message: string, errors: KeyValue) {
		super(message);
		this.name = 'InvalidParams';
		this.errors = errors;
	}
}

export { InvalidParams };
