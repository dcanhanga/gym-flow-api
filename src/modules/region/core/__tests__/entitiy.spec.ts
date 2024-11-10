import { httpStatusCode } from '@/shared/core/constants/http-status-code.js';
import { uuidRegex } from '@/shared/core/utils/regex.js';
import { describe, expect, it } from 'vitest';
import { Region } from '../entity.js';

describe('Region Entity', () => {
	const sut = Region;

	const validInput = {
		name: 'Test Region',
		country: 'Test Country',
		midpoint: { lat: 0, lon: 0 },
		polygon: [
			{ lat: 0, lon: 0 },
			{ lat: 0, lon: 1 },
			{ lat: 1, lon: 1 },
			{ lat: 1, lon: 0 },
			{ lat: 0, lon: 0 },
		],
	};

	describe('quando input é válido', () => {
		it('deve criar uma região com propriedades básicas corretas', () => {
			const result = sut.create(validInput);

			expect(result.isOk).toBe(true);
			expect(result.unwrap.id).toMatch(uuidRegex);
			expect(result.unwrap.name).toBe(validInput.name);
			expect(result.unwrap.country).toBe(validInput.country);
			expect(result.unwrap.midpoint).toEqual([
				validInput.midpoint.lat,
				validInput.midpoint.lon,
			]);
		});

		it('deve criar uma região com polígono flat correto', () => {
			const result = sut.create(validInput);

			expect(result.unwrap.polygonFlat).toEqual([
				[validInput.polygon[0].lat, validInput.polygon[0].lon],
				[validInput.polygon[1].lat, validInput.polygon[1].lon],
				[validInput.polygon[2].lat, validInput.polygon[2].lon],
				[validInput.polygon[3].lat, validInput.polygon[3].lon],
				[validInput.polygon[0].lat, validInput.polygon[0].lon],
			]);
		});

		it('deve criar uma região com polígono nested correto', () => {
			const result = sut.create(validInput);

			expect(result.unwrap.polygonNested).toEqual([
				[
					[validInput.polygon[0].lat, validInput.polygon[0].lon],
					[validInput.polygon[1].lat, validInput.polygon[1].lon],
					[validInput.polygon[2].lat, validInput.polygon[2].lon],
					[validInput.polygon[3].lat, validInput.polygon[3].lon],
					[validInput.polygon[0].lat, validInput.polygon[0].lon],
				],
			]);
		});

		it('deve gerar JSON corretamente via toJSON', () => {
			const result = sut.create(validInput);
			const json = result.unwrap.toJSON();

			expect(json).toEqual({
				id: expect.stringMatching(uuidRegex),
				name: validInput.name,
				country: validInput.country,
				midpoint: [validInput.midpoint.lat, validInput.midpoint.lon],
				polygon: [
					[
						[validInput.polygon[0].lat, validInput.polygon[0].lon],
						[validInput.polygon[1].lat, validInput.polygon[1].lon],
						[validInput.polygon[2].lat, validInput.polygon[2].lon],
						[validInput.polygon[3].lat, validInput.polygon[3].lon],
						[validInput.polygon[0].lat, validInput.polygon[0].lon],
					],
				],
			});
		});
	});

	describe('quando input é inválido', () => {
		it('deve falhar quando nome está vazio', () => {
			const result = sut.create({
				...validInput,
				name: '',
			});

			expect(result.isFail).toBe(true);
			expect(result.unwrapError.statusCode).toBe(httpStatusCode.BAD_REQUEST);
			expect(result.unwrapError.context).toHaveProperty(
				'name',
				'Name cannot be empty',
			);
		});

		it('deve falhar quando país está vazio', () => {
			const result = sut.create({
				...validInput,
				country: '',
			});

			expect(result.isFail).toBe(true);
			expect(result.unwrapError.statusCode).toBe(httpStatusCode.BAD_REQUEST);
			expect(result.unwrapError.context).toHaveProperty(
				'country',
				'Country cannot be empty',
			);
		});

		it('deve falhar quando midpoint tem latitude inválida', () => {
			const result = sut.create({
				...validInput,
				midpoint: { lat: 91, lon: 0 },
			});

			expect(result.isFail).toBe(true);
			expect(result.unwrapError.statusCode).toBe(httpStatusCode.BAD_REQUEST);
			expect(result.unwrapError.context).toHaveProperty('midpoint');
		});

		it('deve falhar quando polígono não é fechado', () => {
			const result = sut.create({
				...validInput,
				polygon: [
					{ lat: 0, lon: 0 },
					{ lat: 0, lon: 1 },
					{ lat: 1, lon: 1 },
					{ lat: 1, lon: 0 },
				], // Falta o ponto final igual ao inicial
			});

			expect(result.isFail).toBe(true);
			expect(result.unwrapError.statusCode).toBe(httpStatusCode.BAD_REQUEST);
			expect(result.unwrapError.context).toHaveProperty('polygon');
		});

		it('deve falhar quando polígono tem menos de 4 pontos', () => {
			const result = sut.create({
				...validInput,
				polygon: [
					{ lat: 0, lon: 0 },
					{ lat: 0, lon: 1 },
					{ lat: 1, lon: 1 },
				],
			});

			expect(result.isFail).toBe(true);
			expect(result.unwrapError.statusCode).toBe(httpStatusCode.BAD_REQUEST);
			expect(result.unwrapError.context).toHaveProperty('polygon');
		});
	});
});
