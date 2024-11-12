import { describe, expect, it } from 'vitest';
import { GeoPoint2dValidator } from '../geo-point2d.js';

describe('GeoPoint2dValidator', () => {
	const sut = GeoPoint2dValidator;

	describe('Validação de Latitude', () => {
		it('deve retornar falso se a latitude estiver fora do intervalo [-90, 90]', () => {
			expect(sut.checkLatitude(-91)).toBe(false);
			expect(sut.checkLatitude(91)).toBe(false);
		});

		it('deve retornar verdadeiro se a latitude estiver dentro do intervalo [-90, 90]', () => {
			expect(sut.checkLatitude(-90)).toBe(true);
			expect(sut.checkLatitude(90)).toBe(true);
			expect(sut.checkLatitude(0)).toBe(true);
		});
	});

	describe('Validação de Longitude', () => {
		it('deve retornar falso se a longitude estiver fora do intervalo [-180, 180]', () => {
			expect(sut.checkLongitude(-181)).toBe(false);
			expect(sut.checkLongitude(181)).toBe(false);
		});

		it('deve retornar verdadeiro se a longitude estiver dentro do intervalo [-180, 180]', () => {
			expect(sut.checkLongitude(-180)).toBe(true);
			expect(sut.checkLongitude(180)).toBe(true);
			expect(sut.checkLongitude(0)).toBe(true);
		});
	});
});
