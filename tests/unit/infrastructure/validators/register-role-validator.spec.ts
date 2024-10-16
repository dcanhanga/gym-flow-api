import { beforeEach, describe, expect, it } from 'vitest';

import { messages } from '@/application/errors/message';
import { ZodRegisterRoleValidator } from '@/infrastructure/validators/zod/register-role-validator';

const VALID_ROLES = ['ADMIN', 'USER', 'MANAGER'] as const;
const INVALID_ROLES = ['', 1, [], {}, 'admin'];
const invalidInputs = [null, 123, 'string', [], true];

describe('Validator: RegisterRoleValidator - teste unitário', () => {
	let validator: ZodRegisterRoleValidator;

	beforeEach(() => {
		validator = new ZodRegisterRoleValidator();
	});

	describe('Casos de erro', () => {
		it.each(INVALID_ROLES)(
			'deve retornar o erro ROLE_MUST_BE_MANAGER_ADMIN_OR_USER quando o role fornecido for diferente de uma string valia',
			(role) => {
				//@ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
				const result = validator.validate({ name: role });
				expect(result).toStrictEqual({
					errors: {
						name: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
					},
				});
			},
		);

		it.each(invalidInputs)(
			'deve retornar erro quando a estrutura não for um objeto',
			(input) => {
				//@ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
				const result = validator.validate(input);

				expect(result?.errors).toHaveProperty('invalidType');
			},
		);
	});

	describe('Casos de sucesso', () => {
		it.each(VALID_ROLES)(
			'deve validar corretamente quando role for "%s"',
			(name) => {
				const result = validator.validate({ name });

				expect(result).toBeNull();
			},
		);
	});
});
