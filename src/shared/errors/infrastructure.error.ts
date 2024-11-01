import { BaseError } from './base.error.js';

export class InfrastructureError extends BaseError {
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, 'INFRASTRUCTURE_ERROR', 503, context);
	}
}

export class DatabaseConnectionError extends InfrastructureError {
	constructor(details: string) {
		super('Database connection failed', { details });
	}
}
