import { randomUUID } from 'node:crypto';
import { uuidRegex } from '@/shared/utils/regex.js';
import { Result } from '@/shared/utils/result.js';
import { ValueObject } from './value-object.js';

interface UUIDProps {
	value: string;
}

export class UUID extends ValueObject<UUIDProps> {
	private constructor(props: UUIDProps) {
		super(props);
	}

	public static create(id?: string): Result<UUID, Error> {
		const uuid = id ?? randomUUID();

		if (!UUID.validate(uuid)) {
			return Result.fail(new Error('Invalid UUID format'));
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
