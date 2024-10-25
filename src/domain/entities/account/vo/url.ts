import { InvalidParametersError, messages } from '@/domain/errors';

export class Url {
	private value: string | null = null;

	constructor(value: string | null) {
		try {
			if (value) {
				new URL(value);
				this.value = value;
				return;
			}
			this.value = null;
		} catch (_error) {
			throw new InvalidParametersError(messages.INVALID_INPUT_PARAMETERS, {
				url: 'invalid url',
			});
		}
	}

	getValue() {
		return this.value;
	}
}
