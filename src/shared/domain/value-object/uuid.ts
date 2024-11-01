import { randomUUID } from 'node:crypto';
import { InvalidUUIDError } from '@/shared/errors/domain.error.js';
import { uuidRegex } from '@/shared/utils/regex.js';
import { Result } from '@/shared/utils/result.js';
import { ValueObject } from './value-object.js';

type UUIDProps = {
	value: string;
};

export class UUID extends ValueObject<UUIDProps> {
	private constructor(props: UUIDProps) {
		super(props);
	}

	public static create(id?: string): Result<UUID, Error> {
		const uuid = id ?? randomUUID();

		if (!UUID.validate(uuid)) {
			return Result.fail(new InvalidUUIDError(uuid));
		}

		return Result.ok(new UUID({ value: uuid }));
	}

	private static validate(uuid: string): boolean {
		return uuidRegex.test(uuid);
	}

	public getValue(): string {
		return this.props.value;
	}
}
