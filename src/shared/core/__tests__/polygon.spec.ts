import { describe, expect, it } from 'vitest';

import { AppError } from '@/shared/errors/app-error.js';
import { Polygon } from '../value-object/polygon.js';

describe('Polygon Value Object', () => {
	const sut = Polygon;
	describe('Método create', () => {
		it('deve criar uma instância de Polygon com coordenadas válidas', () => {
			const input = [
				{ lat: 0, lon: 0 },
				{ lat: 0, lon: 1 },
				{ lat: 1, lon: 1 },
				{ lat: 1, lon: 0 },
				{ lat: 0, lon: 0 },
			];
			const result = sut.create(input);

			expect(result.isOk).toBe(true);
			expect(result.unwrap).toBeInstanceOf(Polygon);
		});
		it('deve retornar um erro se o polígono não estiver fechado', () => {
			const input = [
				{ lat: 0, lon: 0 },
				{ lat: 0, lon: 1 },
				{ lat: 1, lon: 1 },
				{ lat: 1, lon: 0 },
			];

			const result = sut.create(input);

			expect(result.isFail).toBe(true);
			expect(result.unwrapError).toBeInstanceOf(AppError);
		});
		it('deve retornar um erro se houver uma latitude inválida', () => {
			const input = [
				{ lat: 95, lon: 0 },
				{ lat: 0, lon: 1 },
				{ lat: 1, lon: 1 },
				{ lat: 1, lon: 0 },
				{ lat: 95, lon: 0 },
			];
			const result = sut.create(input);

			expect(result.isFail).toBe(true);
			expect(result.unwrapError).toBeInstanceOf(AppError);
		});
		it('deve retornar um erro se houver uma longitude inválida', () => {
			const input = [
				{ lat: 0, lon: 0 },
				{ lat: 0, lon: 181 },
				{ lat: 1, lon: 1 },
				{ lat: 1, lon: 0 },
				{ lat: 0, lon: 0 },
			];
			const result = sut.create(input);

			expect(result.isFail).toBe(true);
			expect(result.unwrapError).toBeInstanceOf(AppError);
		});
	});
	describe('Métodos de transformação de coordenadas', () => {
		it('deve retornar um array aninhado de coordenadas em toNestedArray', () => {
			const input = [
				{ lat: 0, lon: 0 },
				{ lat: 0, lon: 1 },
				{ lat: 1, lon: 1 },
				{ lat: 1, lon: 0 },
				{ lat: 0, lon: 0 },
			];

			const result = sut.create(input);

			expect(result.unwrap.toNestedArray).toEqual([
				[
					[0, 0],
					[0, 1],
					[1, 1],
					[1, 0],
					[0, 0],
				],
			]);
		});

		it('deve retornar um array plano de coordenadas em toFlatArray', () => {
			const input = [
				{ lat: 0, lon: 0 },
				{ lat: 0, lon: 1 },
				{ lat: 1, lon: 1 },
				{ lat: 1, lon: 0 },
				{ lat: 0, lon: 0 },
			];

			const result = sut.create(input);

			expect(result.unwrap.toFlatArray).toEqual([
				[0, 0],
				[0, 1],
				[1, 1],
				[1, 0],
				[0, 0],
			]);
		});
	});
});
