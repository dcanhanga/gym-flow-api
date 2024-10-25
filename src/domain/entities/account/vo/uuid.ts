import { randomUUID } from 'node:crypto';
import { InvalidParametersError, messages } from '@/domain/errors';

export class UUID {
	private value: string;
	constructor(value?: string) {
		if (!value) {
			this.value = randomUUID();
			return;
		}
		if (
			!value.match(
				/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/,
			)
		)
			throw new InvalidParametersError(messages.INVALID_INPUT_PARAMETERS, {
				uuid: 'invalid uuid',
			});
		this.value = value;
	}
	getValue() {
		return this.value;
	}
}
