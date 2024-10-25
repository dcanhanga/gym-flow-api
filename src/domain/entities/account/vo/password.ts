import { InvalidParametersError, messages } from '@/domain/errors';

export class Password {
	private value: string;

	constructor(value: string) {
		if (
			!(
				value.match(/\d/) &&
				value.match(/[A-Z]/) &&
				value.match(/[ $*.\[\]{}()?!"@#%&/\\,><'":;|_~`=+-]/)
			)
		)
			throw new InvalidParametersError(messages.INVALID_INPUT_PARAMETERS, {
				password: 'invalid name',
			});
		this.value = value;
	}
	getValue() {
		return this.value;
	}
}
