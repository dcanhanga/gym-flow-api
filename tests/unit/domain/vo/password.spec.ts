import { describe, expect, test } from 'vitest';

import { DomainError, messages } from '@/domain/errors';
import { Password } from '@/domain/vo/password';

describe('Password Value Object', () => {
	test('deve criar uma senha quando a entrada for válida', () => {
		const input = 'teste@1A';
		const password = new Password(input);
		expect(password.getValue()).toStrictEqual(input);
	});

	test('não deve criar uma senha quando a entrada tiver menos de 8 caracteres', () => {
		const input = 'pass1A!';
		expect(() => new Password(input)).toThrow(
			new DomainError(messages.PASSWORD_TOO_SHORT),
		);
	});

	test('não deve criar uma senha quando a entrada não contiver pelo menos um número', () => {
		const input = 'Password!';
		expect(() => new Password(input)).toThrow(
			new DomainError(messages.PASSWORD_NO_NUMBER),
		);
	});

	test('não deve criar uma senha quando a entrada não contiver pelo menos um caractere maiúsculo', () => {
		const input = 'password8!';
		expect(() => new Password(input)).toThrow(
			new DomainError(messages.PASSWORD_NO_UPPERCASE),
		);
	});

	test('não deve criar uma senha quando a entrada não contiver pelo menos um caractere especial', () => {
		const input = 'Password8';
		expect(() => new Password(input)).toThrow(
			new DomainError(messages.PASSWORD_NO_SPECIAL_CHAR),
		);
	});
});
