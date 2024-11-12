export class AppError<T = unknown> extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode: number,
		public readonly details?: T,
	) {
		super(message);
		this.name = 'AppError';
		Error.captureStackTrace(this, this.constructor);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
