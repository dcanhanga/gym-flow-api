import { DomainError, messages } from '@/domain/errors';
import { nameRegex } from '../utils/regex';

export class Name {
	private value: string;

	constructor(value: string) {
		if (!value.match(nameRegex)) {
			throw new DomainError(messages.INVALID_NAME_FORMAT);
		}
		this.value = value;
	}

	getValue() {
		return this.value;
	}
}
