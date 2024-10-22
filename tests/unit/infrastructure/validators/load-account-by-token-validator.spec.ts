import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthenticationRequiredError } from '@/domain/errors';
import { ZodLoadAccountByTokenValidator } from '@/infrastructure/validators/zod/load-account-by-token-validator';

const VALID_TOKEN =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const INVALID_TOKEN = [1, [], {}, 'token'];
const invalidInputs = [null, 123, 'string', [], true];

describe('Validator: RegisterRoleValidator - teste unitário', () => {
	function setup() {
		const sut = new ZodLoadAccountByTokenValidator();
		return { sut };
	}
	beforeEach(() => {});
	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('Casos de erro', () => {
		it.each(INVALID_TOKEN)(
			'deve retornar erro quando o token for invalido',
			(token) => {
				const { sut } = setup();
				//@ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
				expect(() => sut.validate({ token })).throw(
					AuthenticationRequiredError,
				);
			},
		);

		it.each(invalidInputs)(
			'deve retornar erro quando a estrutura não for um objeto',
			(input) => {
				const { sut } = setup();
				//@ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
				expect(() => sut.validate(input)).throw(AuthenticationRequiredError);
			},
		);

		it('deve propagar o erro se o zod lançar um erro interno', () => {
			const mockZodError = new Error('Erro interno do Zod');
			const { sut } = setup();
			vi.spyOn(sut['loadAccountByTokenSchema'], 'safeParse').mockImplementation(
				() => {
					throw mockZodError;
				},
			);
			expect(() => {
				sut.validate({ token: VALID_TOKEN });
			}).toThrow(mockZodError);
		});
	});

	describe('Casos de sucesso', () => {
		it('deve validar corretamente quando token for um jwt valido', () => {
			const { sut } = setup();
			const result = sut.validate({ token: VALID_TOKEN });

			expect(result).toEqual({ token: VALID_TOKEN });
		});
	});
});
