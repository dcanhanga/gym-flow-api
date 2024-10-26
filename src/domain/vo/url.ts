import { DomainError, messages } from '@/domain/errors';

export class Url {
	private value: string | null = null;

	constructor(value: string | null) {
		if (value === null) {
			this.value = null;
			return;
		}
		this.validate(value);
		this.value = value;
	}
	validate(url: string) {
		try {
			new URL(url);
		} catch (_error) {
			throw new DomainError(messages.INVALID_URL_FORMAT);
		}
	}
	getValue() {
		return this.value;
	}
}
