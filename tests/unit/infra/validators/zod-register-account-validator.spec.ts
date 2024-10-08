import { validatorMessage } from '@/app/validator-message';
import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';
import { ZodRegisterAccountValidator } from '@/infra/validators/zod-register-account-validator';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ZodRegisterAccountValidator', () => {
	let validator: ZodRegisterAccountValidator;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let fields: any;

	beforeEach(() => {
		validator = new ZodRegisterAccountValidator();
		fields = {};
	});

	it('deve validar os dados corretamente', () => {
		fields = {
			email: 'user@example.com',
			name: 'User',
			password: 'password123',
			role: 'user',
		};

		const result = validator.validate({ ...fields });

		expect(result).toBeNull(); // Sem erros, resultado esperado é null
	});

	it('deve retornar erro "NAME_IS_REQUIRED" quando o campo "name" não é enviado', () => {
		fields = {
			email: 'example@example.com',
			password: '@valid2P',
			role: 'admin',
		};

		const result = validator.validate({ ...fields });

		expect(result).toStrictEqual({
			errors: {
				name: validatorMessage.NAME_IS_REQUIRED,
			},
		});
	});

	it('deve retornar erro "NAME_MUST_BE_A_STRING" quando o campo "name" não é uma string', () => {
		fields = {
			name: {} as unknown as string, // Forçando tipo errado
			email: 'example@example.com',
			password: '@valid2P',
			role: 'admin',
		};

		const result = validator.validate({ ...fields });

		expect(result).toStrictEqual({
			errors: {
				name: validatorMessage.NAME_MUST_BE_A_STRING,
			},
		});
	});

	it('deve retornar erro "INVALID_ROLE" quando o campo "role" não é uma string', () => {
		fields = {
			name: 'Luzia',
			email: 'example@example.com',
			password: '@valid2P',
			role: {}, // Forçando tipo errado
		};

		const result = validator.validate({ ...fields });

		expect(result).toStrictEqual({
			errors: {
				role: validatorMessage.INVALID_ROLE,
			},
		});
	});

	it('deve retornar erro "INVALID_ROLE" quando o campo "role" contém um valor inválido', () => {
		fields = {
			name: 'Domingos',
			email: 'example@example.com',
			password: '@valid2P',
			role: 'domi', // Valor de role inválido
		};

		const result = validator.validate({ ...fields });

		expect(result).toStrictEqual({
			errors: {
				role: validatorMessage.INVALID_ROLE,
			},
		});
	});
});
