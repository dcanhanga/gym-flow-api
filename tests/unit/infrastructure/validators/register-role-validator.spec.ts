import { beforeEach, describe, expect, it } from 'vitest';

import { messages } from '@/application/errors/message';
import { ZodRegisterRoleValidator } from '@/infrastructure/validators/zod/register-role-validator';

const VALID_ROLES = ['ADMIN', 'USER', 'SUPER'] as const;

describe('Validator: RegisterRoleValidator - teste unitário', () => {
	let validator: ZodRegisterRoleValidator;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let fields: any;

	beforeEach(() => {
		validator = new ZodRegisterRoleValidator();
		fields = {};
	});

	describe('Casos de erro', () => {
		it('deve retornar erro quando o "role" não é uma string', () => {
			fields = { name: {} };

			const result = validator.validate({ ...fields });

			expect(result).toStrictEqual({
				errors: {
					name: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
				},
			});
		});

		it('deve retornar erro quando o "role" enviado não é válido', () => {
			fields = { name: 'client' };

			const result = validator.validate({ ...fields });

			expect(result).toStrictEqual({
				errors: {
					name: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
				},
			});
		});

		it('deve retornar erro quando o "role" é uma string vazia', () => {
			fields = { name: '' };

			const result = validator.validate({ ...fields });

			expect(result).toStrictEqual({
				errors: {
					name: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
				},
			});
		});

		it('deve retornar erro quando o "role" é undefined', () => {
			fields = { name: undefined };

			const result = validator.validate({ ...fields });

			expect(result).toStrictEqual({
				errors: {
					name: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
				},
			});
		});
	});

	describe('Casos de sucesso', () => {
		it.each(VALID_ROLES)(
			'deve validar corretamente quando role for "%s"',
			(name) => {
				fields = { name };

				const result = validator.validate({ ...fields });

				expect(result).toBeNull();
			},
		);
	});
});
