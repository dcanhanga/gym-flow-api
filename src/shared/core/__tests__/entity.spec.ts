import { describe, expect, it } from 'vitest';
import { BaseEntity } from '../entity/base-entity.js';

class TestEntity extends BaseEntity<{ value: string }> {
	constructor(value: string) {
		super({ value });
	}
}

describe('BaseEntity', () => {
	describe('Criação de entidade', () => {
		it('deve criar uma entidade com props congelados', () => {
			const entity = new TestEntity('test');
			expect(Object.isFrozen(entity['props'])).toBe(true);
		});
	});

	describe('Comparação de entidades', () => {
		it('deve retornar verdadeiro ao comparar duas entidades com props iguais', () => {
			const entity1 = new TestEntity('test');
			const entity2 = new TestEntity('test');
			expect(entity1.equals(entity2)).toBe(true);
		});

		it('deve retornar falso ao comparar duas entidades com props diferentes', () => {
			const entity1 = new TestEntity('test1');
			const entity2 = new TestEntity('test2');
			expect(entity1.equals(entity2)).toBe(false);
		});

		it('deve retornar falso ao comparar com uma entidade nula', () => {
			const entity = new TestEntity('test');
			//@ts-ignore
			expect(entity.equals(null)).toBe(false);
		});

		it('deve retornar falso ao comparar com uma entidade indefinida', () => {
			const entity = new TestEntity('test');
			expect(entity.equals(undefined)).toBe(false);
		});
	});
});
