import { randomUUID } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import { DomainError, messages } from '@/domain/errors';
import { UUID } from '@/domain/vo/uuid';

describe('UUID value object', () => {
	test('deve criar um id UUID quando a entrada for válida', () => {
		const input = randomUUID();

		const uuid = new UUID(input);

		expect(uuid.getValue()).toStrictEqual(input);
	});

	test('deve criar um id UUID quando não tiver dado de entrada', () => {
		const uuid = new UUID();

		expect(uuid.getValue()).toBeTypeOf('string');
	});

	test('não deve criar um UUID com a entrada inválida', () => {
		const input = '';
		expect(() => new UUID(input)).toThrow(
			new DomainError(messages.INVALID_UUID_FORMAT),
		);
	});
});
