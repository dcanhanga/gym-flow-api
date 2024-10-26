import { DomainError, messages } from '@/domain/errors';
import {
	leastOneNumber,
	leastOneSpecialCharacter,
	leastOneUppercase,
} from '@/domain/utils/regex';

export class Password {
	private value: string;

	constructor(value: string) {
		this.validate(value);
		this.value = value;
	}

	private validate(password: string) {
		if (password.length < 8) {
			throw new DomainError(messages.PASSWORD_TOO_SHORT);
		}
		if (!password.match(leastOneNumber)) {
			throw new DomainError(messages.PASSWORD_NO_NUMBER);
		}
		if (!password.match(leastOneUppercase)) {
			throw new DomainError(messages.PASSWORD_NO_UPPERCASE);
		}
		if (!password.match(leastOneSpecialCharacter)) {
			throw new DomainError(messages.PASSWORD_NO_SPECIAL_CHAR);
		}
	}

	getValue() {
		return this.value;
	}
}
