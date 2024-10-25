import { InvalidParametersError, messages } from '@/domain/errors';

export class Name {
	private value: string;

	constructor(value: string) {
		if (!value.match(/^[a-zA-Z]+( [a-zA-Z]+)+$/)) {
			throw new InvalidParametersError(messages.INVALID_INPUT_PARAMETERS, {
				name: 'invalid name',
			});
		}
		this.value = value;
	}

	getValue() {
		return this.value;
	}
}
