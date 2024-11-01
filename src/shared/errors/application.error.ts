import { BaseError } from './base.error.js';

export class ApplicationError extends BaseError {
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, 'APPLICATION_ERROR', 500, context);
	}
}

export class RoleNotFoundError extends ApplicationError {
	constructor(id: string) {
		super('Role not found', { id });
	}
}
