import { describe, expect, it } from 'vitest';
import type { GeoPoint2d } from '../../types/index.js';
import { PolygonPointValidator } from '../polygon-point.js';

describe('PolygonPointValidator', () => {
	const sut = new PolygonPointValidator();

	it('deve retornar um array vazio para coordenadas válidas', () => {
		const input: GeoPoint2d[] = [
			{ lon: 30, lat: -45 },
			{ lon: -75, lat: 60 },
			{ lon: 120, lat: 15 },
		];
		const result = sut.check(input);
		expect(result).toEqual([]);
	});

	it('deve retornar erro para latitude inválida', () => {
		const input: GeoPoint2d[] = [
			{ lon: 30, lat: -91 }, // Latitude inválida
			{ lon: 45, lat: 45 },
		];
		const result = sut.check(input);
		expect(result).toMatchObject([
			{
				type: 'InvalidCoordinate',
				message: 'Latitude inválida: -91. Deve estar entre -90 e 90.',
				details: { index: 0, coordinate: { lat: -91, lon: 30 } },
			},
		]);
	});

	it('deve retornar erro para longitude inválida', () => {
		const input: GeoPoint2d[] = [
			{ lon: 190, lat: -45 }, // Longitude inválida
			{ lon: -30, lat: 30 },
		];
		const result = sut.check(input);
		expect(result).toMatchObject([
			{
				type: 'InvalidCoordinate',
				message: 'Longitude inválida: 190. Deve estar entre -180 e 180.',
				details: { index: 0, coordinate: { lat: -45, lon: 190 } },
			},
		]);
	});

	it('deve detectar múltiplos erros de coordenadas', () => {
		const input: GeoPoint2d[] = [
			{ lon: 190, lat: -91 }, // Longitude e latitude inválidas
			{ lon: 0, lat: 100 }, // Latitude inválida
			{ lon: -200, lat: 45 }, // Longitude inválida
		];
		const result = sut.check(input);
		expect(result).toMatchObject([
			{
				type: 'InvalidCoordinate',
				message: 'Latitude inválida: -91. Deve estar entre -90 e 90.',
				details: { index: 0, coordinate: { lat: -91, lon: 190 } },
			},
			{
				type: 'InvalidCoordinate',
				message: 'Longitude inválida: 190. Deve estar entre -180 e 180.',
				details: { index: 0, coordinate: { lat: -91, lon: 190 } },
			},
			{
				type: 'InvalidCoordinate',
				message: 'Latitude inválida: 100. Deve estar entre -90 e 90.',
				details: { index: 1, coordinate: { lat: 100, lon: 0 } },
			},
			{
				type: 'InvalidCoordinate',
				message: 'Longitude inválida: -200. Deve estar entre -180 e 180.',
				details: { index: 2, coordinate: { lat: 45, lon: -200 } },
			},
		]);
	});
});
