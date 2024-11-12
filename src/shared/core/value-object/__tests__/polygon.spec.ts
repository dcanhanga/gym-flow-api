import { describe, expect, it } from 'vitest';

import { AppError } from '@/shared/core/errors/app-error.js';
import { Polygon } from '../polygon.js';

describe('Polygon Value Object', () => {
	const sut = Polygon;
	describe('Método create', () => {
		it('deve criar uma instância de Polygon com coordenadas válidas', () => {
			const input = [
				{ lon: -3.465, lat: -60.701 },
				{ lon: -3.468, lat: -60.698 },
				{ lon: -3.467, lat: -60.702 },
				{ lon: -3.465, lat: -60.701 },
			];
			const result = sut.create(input);

			expect(result.isOk).toBe(true);
			expect(result.unwrap).toBeInstanceOf(Polygon);
		});
		it('deve retornar um erro se o polígono não estiver fechado', () => {
			const input = [
				{ lon: -3.465, lat: -60.701 },
				{ lon: -3.468, lat: -60.698 },
				{ lon: -3.467, lat: -60.702 },
			];

			const result = sut.create(input);

			expect(result.isFail).toBe(true);
			expect(result.unwrapError).toBeInstanceOf(AppError);
		});
		it('deve retornar um erro se houver uma latitude inválida', () => {
			const input = [
				{ lat: -260.701, lon: -3.465 },
				{ lat: -60.698, lon: -3.468 },
				{ lat: -60.702, lon: -3.467 },
				{ lat: -60.701, lon: -3.465 },
			];
			const result = sut.create(input);

			expect(result.isFail).toBe(true);
			expect(result.unwrapError).toBeInstanceOf(AppError);
		});
		it('deve retornar um erro se houver uma longitude inválida', () => {
			const input = [
				{ lat: -60.701, lon: -3.465 },
				{ lat: -60.698, lon: -360.468 },
				{ lat: -60.702, lon: -3.467 },
				{ lat: -60.701, lon: -3.465 },
			];
			const result = sut.create(input);

			expect(result.isFail).toBe(true);
			expect(result.unwrapError).toBeInstanceOf(AppError);
		});
	});
	describe('Métodos de transformação de coordenadas', () => {
		it('deve retornar um array aninhado de coordenadas em toNestedArray', () => {
			const input = [
				{ lat: -60.701, lon: -3.465 },
				{ lat: -60.698, lon: -3.468 },
				{ lat: -60.702, lon: -3.467 },

				{ lat: -60.701, lon: -3.465 },
			];

			const result = sut.create(input);

			expect(result.isOk).toEqual(true);
		});

		it('deve retornar um array plano de coordenadas em toFlatArray', () => {
			const input = [
				{ lat: -60.701, lon: -3.465 },
				{ lat: -60.698, lon: -3.468 },
				{ lat: -60.702, lon: -3.467 },
				{ lat: -60.701, lon: -3.465 },
			];

			const result = sut.create(input);

			expect(result.isOk).toEqual(true);
		});
	});
});
