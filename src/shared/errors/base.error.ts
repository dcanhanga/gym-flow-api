export abstract class BaseError extends Error {
	constructor(
		public readonly message: string,
		public readonly code: string,
		public readonly statusCode: number,
		public readonly context?: Record<string, unknown>,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}
