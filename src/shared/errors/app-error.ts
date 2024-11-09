export class AppError extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode: number,
		public readonly context?: Record<string, unknown>,
	) {
		super(message);
		this.name = 'AppError';
		Error.captureStackTrace(this, this.constructor);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
