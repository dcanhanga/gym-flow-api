import { InvalidParametersError, messages } from '@/domain/errors';

export class Email {
	private value: string;

	constructor(value: string) {
		if (
			!value.match(
				/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
			)
		)
			throw new InvalidParametersError(messages.INVALID_INPUT_PARAMETERS, {
				email: 'invalid email',
			});

		this.value = value;
	}

	getValue() {
		return this.value;
	}
}
