import { DomainError, messages } from '@/domain/errors';
import { emailRegex } from '../utils/regex';

export class Email {
	private value: string;

	constructor(value: string) {
		if (!value.match(emailRegex))
			throw new DomainError(messages.INVALID_EMAIL_FORMAT);

		this.value = value;
	}

	getValue() {
		return this.value;
	}
}
