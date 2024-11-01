import { messages } from '../utils/messages.js';
import { BaseError } from './base.error.js';

export class DomainError extends BaseError {
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, 'DOMAIN_ERROR', 500, context);
	}
}

export class InvalidUUIDError extends DomainError {
	constructor(uuid: string) {
		super(messages.INVALID_UUID_FORMAT, { uuid });
	}
}

export class InvalidRoleError extends DomainError {
	constructor(role: string) {
		super(messages.INVALID_ROLE_NAME, { role });
	}
}
