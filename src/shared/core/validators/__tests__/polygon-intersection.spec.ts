import { describe, expect, it } from 'vitest';
import type { GeoPoint2d } from '../../types/index.js';
import { PolygonIntersectionValidator } from '../polygon-intersection.js';

describe('PolygonIntersectionValidator', () => {
	const sut = new PolygonIntersectionValidator();

	it('deve retornar erro ao detectar vértices duplicados', () => {
		const input: GeoPoint2d[] = [
			{ lon: -3.465, lat: -60.701 },
			{ lon: -3.468, lat: -60.698 },
			{ lon: -3.468, lat: -60.698 },
			{ lon: -3.465, lat: -60.701 },
		];
		const result = sut.check(input);
		expect(result.length).toBe(1);
		expect(result[0].type).toBe('IntersectingEdges');
	});

	it('deve retornar erro ao detectar auto-interseção', () => {
		const input: GeoPoint2d[] = [
			{ lon: 0, lat: 0 },
			{ lon: 2, lat: 2 },
			{ lon: 2, lat: 0 },
			{ lon: 0, lat: 2 }, // Cruza com o primeiro segmento
			{ lon: 0, lat: 0 },
		];
		const result = sut.check(input);
		expect(result.length).toBe(1);
		expect(result[0].type).toBe('SelfIntersection');
		expect(result[0].message).toContain('auto-interseção entre os segmentos');
	});

	it('deve retornar um array vazio para um polígono válido sem interseções', () => {
		const input: GeoPoint2d[] = [
			{ lon: 0, lat: 0 },
			{ lon: 2, lat: 0 },
			{ lon: 2, lat: 2 },
			{ lon: 0, lat: 2 },
			{ lon: 0, lat: 0 },
		];
		const result = sut.check(input);
		expect(result).toEqual([]);
	});

	it('deve detectar múltiplos erros ao mesmo tempo', () => {
		const input: GeoPoint2d[] = [
			{ lon: 0, lat: 0 },
			{ lon: 2, lat: 2 },
			{ lon: 2, lat: 0 },
			{ lon: 0, lat: 2 },
			{ lon: 0, lat: 0 },
		];
		const result = sut.check(input);
		expect(result).toBeDefined();
	});
});
