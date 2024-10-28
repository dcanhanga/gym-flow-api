export type ErrorResponse = Record<string, string>;

export class AccessForbiddenError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AccessForbiddenError';
		Error.captureStackTrace(this, this.constructor);
	}
}

export class InvalidParametersError extends Error {
	errors: Record<string, string>;
	constructor(message: string, errors: Record<string, string>) {
		super(message);
		this.name = 'InvalidParametersError';
		this.errors = errors;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ResourceConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResourceConflictError';
		Error.captureStackTrace(this, this.constructor);
	}
}

// export class ResourceNotFoundError extends Error {
// 	constructor(message: string) {
// 		super(message);
// 		this.name = 'ResourceNotFoundError';
// 		Error.captureStackTrace(this, this.constructor);
// 	}
// }

// export class AuthenticationRequiredError extends Error {
// 	constructor(message: string) {
// 		super(message);
// 		this.name = 'AuthenticationRequiredError';
// 		Error.captureStackTrace(this, this.constructor);
// 	}
// }

// export class NoChangesError extends Error {
// 	constructor(message: string) {
// 		super(message);
// 		this.name = 'NoChangesError';
// 		Error.captureStackTrace(this, this.constructor);
// 	}
// }
