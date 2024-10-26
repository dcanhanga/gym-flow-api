import { describe, expect, test } from 'vitest';

import { DomainError, messages } from '@/domain/errors';
import { Name } from '@/domain/vo/name';

describe('Name value object', () => {
	test('deve criar um nome quando a entrada for válida', () => {
		const input = 'john doe';
		const name = new Name(input);

		expect(name.getValue()).toStrictEqual(input);
	});

	test('não deve criar um name com a entrada inválida', () => {
		const input = '';
		expect(() => new Name(input)).toThrow(
			new DomainError(messages.INVALID_NAME_FORMAT),
		);
	});
});
