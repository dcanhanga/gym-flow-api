import { describe, expect, it } from 'vitest';

import { ValueObject } from '../value-object.js';

class TestValueObject extends ValueObject<{ input: string }> {
	constructor(input: string) {
		super({ input });
	}
}

describe('ValueObject', () => {
	describe('Criação de ValueObject', () => {
		it('deve criar um objeto de valor com props congelados', () => {
			const vo = new TestValueObject('test');
			expect(Object.isFrozen(vo['input'])).toBe(true);
		});
	});

	// Testes de comparação
	describe('Comparação de ValueObjects', () => {
		it('deve retornar verdadeiro ao comparar dois objetos de valor igual', () => {
			const vo1 = new TestValueObject('test');
			const vo2 = new TestValueObject('test');
			expect(vo1.equals(vo2)).toBe(true);
		});

		it('deve retornar falso ao comparar dois objetos de valor diferentes', () => {
			const vo1 = new TestValueObject('test1');
			const vo2 = new TestValueObject('test2');
			expect(vo1.equals(vo2)).toBe(false);
		});

		it('deve retornar falso ao comparar com nulo', () => {
			const vo = new TestValueObject('test');
			// @ts-ignore
			expect(vo.equals(null)).toBe(false);
		});

		it('deve retornar falso ao comparar com undefined', () => {
			const vo = new TestValueObject('test');
			expect(vo.equals(undefined)).toBe(false);
		});
	});
});
