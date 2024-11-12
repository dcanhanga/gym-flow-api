import { beforeEach, describe, expect, it } from 'vitest';
import type { GeoPoint2d, PolygonError } from '../../types/index.js';
import { PolygonClosureValidator } from '../polygon-closure.js';

describe('PolygonClosureValidator', () => {
	let sut: PolygonClosureValidator;

	// Dados de entrada para os testes
	const closedPolygon: GeoPoint2d[] = [
		{ lon: -3.465, lat: -60.701 },
		{ lon: -3.468, lat: -60.698 },
		{ lon: -3.467, lat: -60.702 },
		{ lon: -3.465, lat: -60.701 },
	];

	const openPolygon: GeoPoint2d[] = [
		{ lon: -3.465, lat: -60.701 },
		{ lon: -3.468, lat: -60.698 },
		{ lon: -3.467, lat: -60.702 },
	];

	beforeEach(() => {
		sut = new PolygonClosureValidator();
	});

	it('deve retornar um array de PolygonError se o polígono não estiver fechado', () => {
		const result = sut.check(openPolygon);

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
		expect(result[0]).toBeDefined();
		expect(result[0]).toMatchObject({
			type: 'InvalidPolygon',
		});
	});

	it('deve retornar um array vazio se o polígono estiver fechado corretamente', () => {
		const result = sut.check(closedPolygon);

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(0);
	});
});
