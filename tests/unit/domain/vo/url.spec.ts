import { randomUUID } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import { DomainError, messages } from '@/domain/errors';
import { Url } from '@/domain/vo';

describe('Url value object', () => {
	test('deve criar uma url quando a entrada for válida', () => {
		const input = 'https://www.google.com';

		const uuid = new Url(input);

		expect(uuid.getValue()).toStrictEqual(input);
	});

	test('deve criar um id UUID quando não tiver dado de entrada', () => {
		const url = new Url(null);

		expect(url.getValue()).toStrictEqual(null);
	});

	test('não deve criar um UUID com a entrada inválida', () => {
		const input = '';
		expect(() => new Url(input)).toThrow(
			new DomainError(messages.INVALID_URL_FORMAT),
		);
	});
});
