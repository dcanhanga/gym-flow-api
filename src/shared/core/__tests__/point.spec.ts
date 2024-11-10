import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/core/constants/messages.js';
import { AppError } from '@/shared/core/errors/app-error.js';
import { Point } from '../value-object/point.js';

describe('Point Value Object', () => {
	const sut = Point;

	it('deve retornar um erro quando a latitude estiver fora do intervalo [-90, 90]', () => {
		const input = { lat: 91, lon: 0 };
		const result = sut.create(input);

		expect(result.isFail).toBe(true);
		expect(result.unwrapError).instanceof(AppError);
		expect(result.unwrapError.context).toMatchObject({
			details: {
				latitude: messages.INVALID_LATITUDE_PROVIDED.replace(
					'value',
					`${input.lat}`,
				),
			},
		});
	});

	it('deve retornar um erro quando a longitude estiver fora do intervalo [-180, 180]', () => {
		const input = { lat: 90, lon: -189 };
		const result = sut.create(input);

		expect(result.isFail).toBe(true);
		expect(result.unwrapError).instanceof(AppError);
		expect(result.unwrapError.context).toMatchObject({
			details: {
				longitude: messages.INVALID_LONGITUDE_PROVIDED.replace(
					'value',
					`${input.lon}`,
				),
			},
		});
	});

	it('deve criar um ponto quando as coordenadas forem válidas', () => {
		const input = { lat: 23, lon: 45 };
		const result = sut.create(input);

		expect(result.isOk).toBe(true);
		expect(result.unwrap.getValue).toStrictEqual(input);
	});

	it('deve retornar as coordenadas como um array', () => {
		const input = { lat: 23, lon: 45 };
		const result = sut.create(input);

		expect(result.isOk).toBe(true);
		expect(result.unwrap.toArray).toStrictEqual([input.lat, input.lon]);
	});
});
