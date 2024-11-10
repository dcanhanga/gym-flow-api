import { randomUUID } from 'node:crypto';
import { httpStatusCode } from '@/shared/core/constants/http-status-code.js';
import { messages } from '@/shared/core/constants/messages.js';
import { AppError } from '@/shared/core/errors/app-error.js';
import { uuidRegex } from '@/shared/core/utils/regex.js';
import { Result } from '@/shared/core/utils/result.js';
import { ValueObject } from './value-object.js';

type UUIDInput = {
	value: string;
};

export class UUID extends ValueObject<UUIDInput> {
	private constructor(props: UUIDInput) {
		super(props);
	}

	public static create(id?: string): Result<UUID, AppError> {
		const uuid = id ?? randomUUID();

		if (!UUID.validate(uuid)) {
			return Result.fail(
				new AppError(messages.INVALID_UUID_FORMAT, httpStatusCode.BAD_REQUEST),
			);
		}

		return Result.ok(new UUID({ value: uuid }));
	}

	private static validate(uuid: string): boolean {
		return uuidRegex.test(uuid);
	}
	public get getValue(): string {
		return this.input.value;
	}
}
