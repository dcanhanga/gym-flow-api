export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DomainError';
		Error.captureStackTrace(this, this.constructor);
	}
}

export { messages } from './message';
