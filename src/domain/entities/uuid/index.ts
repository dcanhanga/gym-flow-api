import { InvalidParametersError } from '@/domain/errors';
import { messages } from '@/domain/errors/message';
class UUID {
	private constructor(private value: string) {
		Object.freeze(this);
	}
	private static validate(value: string): void {
		const regex =
			/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
		if (!regex.test(value)) {
			throw new InvalidParametersError(messages.INVALID_INPUT_PARAMETERS, {
				id: messages.INVALID_ID_FORMAT,
			});
		}
	}
	public static create(value: string): UUID {
		UUID.validate(value);
		return new UUID(value);
	}
	getValue(): string {
		return this.value;
	}
}
export { UUID };
