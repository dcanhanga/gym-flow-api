import { describe, expect, test } from 'vitest';

import { DomainError, messages } from '@/domain/errors';
import { Email } from '@/domain/vo/email';

describe('Email value object', () => {
	test('deve criar um Email quando a entrada for válida', () => {
		const input = 'teste@dominio.com';
		const email = new Email(input);
		expect(email.getValue()).toStrictEqual(input);
	});

	test('não deve criar um Email com a entrada inválida', () => {
		const input = 'email_invalido';
		expect(() => new Email(input)).toThrow(
			new DomainError(messages.INVALID_EMAIL_FORMAT),
		);
	});

	test('lança um erro específico para emails em formato incorreto', () => {
		const input = 'usuario@dominio';
		expect(() => new Email(input)).toThrowError(
			new DomainError(messages.INVALID_EMAIL_FORMAT),
		);
	});
});
