import { describe, expect, it } from 'vitest';
import { Result } from '../../utils/result.js';

describe('Result', () => {
	describe('Casos de Sucesso', () => {
		it('deve criar um Result de sucesso com um valor', () => {
			const result = Result.ok('valor de sucesso');
			expect(result.isOk).toBe(true);
			expect(result.isFail).toBe(false);
			expect(result.unwrap).toBe('valor de sucesso');
		});

		it('deve retornar o valor correto ao chamar unwrap() em um Result de sucesso', () => {
			const result = Result.ok(123);
			expect(result.unwrap).toBe(123);
		});
	});

	describe('Casos de Erro', () => {
		it('deve criar um Result de erro com uma mensagem de erro', () => {
			const error = new Error('Erro de teste');
			const result = Result.fail(error);
			expect(result.isOk).toBe(false);
			expect(result.isFail).toBe(true);
			expect(result.unwrapError).toBe(error);
		});

		it('deve lançar um erro ao chamar unwrap() em um Result de falha', () => {
			const error = new Error('Erro ao acessar valor de falha');
			const result = Result.fail(error);
			expect(() => result.unwrap).toThrowError(error);
		});

		it('deve lançar um erro ao chamar unwrapError() em um Result de sucesso', () => {
			const result = Result.ok('valor de sucesso');
			expect(() => result.unwrapError).toThrowError(
				'Cannot get error from success result',
			);
		});
	});
});
