import { beforeEach, describe, expect, it } from 'vitest';

import { validatorMessage } from '@/application/validator-message';
import { ZodRegisterAccountValidator } from '@/infrastructure/validators/zod/zod-register-account-validator';

describe('ZodRegisterAccountValidator', () => {
	let validator: ZodRegisterAccountValidator;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let fields: any;

	beforeEach(() => {
		validator = new ZodRegisterAccountValidator();
		fields = {};
	});
	describe('Caso de erros', () => {
		describe('email', () => {
			it(`deve retornar erro "${validatorMessage.EMAIL_IS_REQUIRED}" quando o campo "email" não é enviado`, () => {
				fields = {
					name: 'User',
					password: 'passworD@d123',
					role: 'user',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						email: validatorMessage.EMAIL_IS_REQUIRED,
					},
				});
			});
			it(`deve retornar erro "${validatorMessage.INVALID_EMAIL}" quando o campo "email" não é um email`, () => {
				fields = {
					name: 'User',
					email: 'example',
					password: 'passworD@d123',
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						email: validatorMessage.INVALID_EMAIL,
					},
				});
			});
		});
		describe('name', () => {
			it(`deve retornar erro "${validatorMessage.NAME_IS_REQUIRED}" quando o campo "name" não é enviado`, () => {
				fields = {
					email: 'example@example.com',
					password: 'passworD@d123',
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						name: validatorMessage.NAME_IS_REQUIRED,
					},
				});
			});
			it(`deve retornar erro "${validatorMessage.NAME_MUST_BE_A_STRING}" quando o campo "name" não é uma string`, () => {
				fields = {
					name: 123,
					email: 'example@example.com',
					password: 'passworD@d123',
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						name: validatorMessage.NAME_MUST_BE_A_STRING,
					},
				});
			});
		});
		describe('role', () => {
			it(`deve retornar erro "${validatorMessage.INVALID_ROLE}" quando o campo "role" não é uma string`, () => {
				fields = {
					name: 'Luzia',
					email: 'example@example.com',
					password: 'passworD@d123',
					role: {},
				};

				const result = validator.validate({ ...fields });

				expect(result).toStrictEqual({
					errors: {
						role: validatorMessage.INVALID_ROLE,
					},
				});
			});
		});
		describe('password', () => {
			it(`deve retornar erro "${validatorMessage.PASSWORD_IS_REQUIRED}" quando o campo "password" não é enviado`, () => {
				fields = {
					name: 'User',
					email: 'example@example.com',
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						password: validatorMessage.PASSWORD_IS_REQUIRED,
					},
				});
			});
			it(`deve retornar erro "${validatorMessage.PASSWORD_MUST_BE_A_STRING}" quando o campo "password" não é uma string`, () => {
				fields = {
					name: 'User',
					email: 'example@example.com',
					password: 123,
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						password: validatorMessage.PASSWORD_MUST_BE_A_STRING,
					},
				});
			});
			it(`deve retornar erro "${validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_EIGHT_CHARACTERS}" quando o campo "password nao tiver ao menos 8 caracteres"`, () => {
				fields = {
					name: 'User',
					email: 'example@example.com',
					password: '12A3@',
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						password:
							validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_EIGHT_CHARACTERS,
					},
				});
			});
			it(`deve retornar erro "${validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_NUMBER}" quando o campo password não tem ao menos um número`, () => {
				fields = {
					name: 'User',
					email: 'example@example.com',
					password: 'passworD@',
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						password: validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_NUMBER,
					},
				});
			});
			it(`deve retornar erro "${validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_CAPITAL_LETTER}" quando o campo password não tem ao menos uma letra maiúscula`, () => {
				fields = {
					name: 'User',
					email: 'example@example.com',
					password: 'passwor@123',
					role: 'admin',
				};
				const result = validator.validate({ ...fields });
				expect(result).toStrictEqual({
					errors: {
						password:
							validatorMessage.PASSWORD_MUST_HAVE_AT_LEAST_ONE_CAPITAL_LETTER,
					},
				});
			});
		});
	});
	describe('Caso de sucesso', () => {
		it('deve validar os dados corretamente', () => {
			fields = {
				email: 'user@example.com',
				name: 'User',
				password: 'passworD@d123',
				role: 'user',
			};

			const result = validator.validate({ ...fields });

			expect(result).toBeNull();
		});
	});
});
