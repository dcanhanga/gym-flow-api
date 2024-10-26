import { randomUUID } from 'node:crypto';
import { DomainError, messages } from '@/domain/errors';
import { uuidRegex } from '../utils/regex';

export class UUID {
	private value: string;
	constructor(value?: string) {
		if (typeof value === 'undefined') {
			this.value = randomUUID();
			return;
		}
		this.validate(value);
		this.value = value;
	}
	validate(uuid: string) {
		if (!uuid.match(uuidRegex))
			throw new DomainError(messages.INVALID_UUID_FORMAT);
	}
	getValue() {
		return this.value;
	}
}
