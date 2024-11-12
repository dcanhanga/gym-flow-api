import { randomUUID } from 'node:crypto';
import { AppError } from '@/shared/core/errors/app-error.js';
import { describe, expect, it, vi } from 'vitest';
import { RegionValidator } from '../region.js';

describe('RegionValidator', () => {
	const sut = RegionValidator;

	// Input válido para reuso nos testes
	const validInput = {
		id: randomUUID(),
		name: 'Test Region',
		country: 'Test Country',
		midpoint: { lat: 0, lon: 0 },
		polygon: [
			{ lon: -3.465, lat: -60.701 },
			{ lon: -3.468, lat: -60.698 },
			{ lon: -3.467, lat: -60.702 },
			{ lon: -3.465, lat: -60.701 },
		],
	};

	describe('validate', () => {
		describe('Sucesso', () => {
			it('deve retornar sucesso quando todos os campos são válidos', () => {
				const result = sut.validate(validInput);

				expect(result.isOk).toBe(true);
			});

			it('deve remover espaços em branco do nome e país', () => {
				const input = {
					...validInput,
					name: '  Test Region  ',
					country: '  Test Country  ',
				};

				const result = sut.validate(input);

				expect(result.isOk).toBe(true);
				expect(result.unwrap.name).toBe('Test Region');
				expect(result.unwrap.country).toBe('Test Country');
			});
		});

		describe('Erros', () => {
			it('deve falhar quando UUID é inválido', () => {
				const result = sut.validate({
					...validInput,
					id: 'invalid-uuid',
				});

				expect(result.isFail).toBe(true);
			});

			it('deve falhar quando nome está vazio', () => {
				const result = sut.validate({
					...validInput,
					name: '   ',
				});

				expect(result.isFail).toBe(true);
				expect(result.unwrapError.details).toHaveProperty(
					'name',
					'Name cannot be empty',
				);
			});

			it('deve falhar quando país está vazio', () => {
				const result = sut.validate({
					...validInput,
					country: '   ',
				});

				expect(result.isFail).toBe(true);
				expect(result.unwrapError.details).toHaveProperty(
					'country',
					'Country cannot be empty',
				);
			});

			it('deve falhar quando midpoint é inválido', () => {
				const result = sut.validate({
					...validInput,
					midpoint: { lat: 91, lon: 0 },
				});

				expect(result.isFail).toBe(true);
				expect(result.unwrapError.details).toHaveProperty('midpoint');
			});

			it('deve falhar quando polígono é inválido', () => {
				const result = sut.validate({
					...validInput,
					polygon: [
						{ lat: 0, lon: 0 },
						{ lat: 0, lon: 1 },
						{ lat: 1, lon: 1 },
					],
				});

				expect(result.isFail).toBe(true);
				expect(result.unwrapError.details).toHaveProperty('polygon');
			});

			it('deve retornar todos os erros de validação quando múltiplos campos são inválidos', () => {
				const invalidInput = {
					id: ' ',
					name: ' ',
					country: ' ',
					midpoint: { lat: 91, lon: 0 },
					polygon: [
						{ lat: 0, lon: 0 },
						{ lat: 0, lon: 1 },
					],
				};
				const result = sut.validate(invalidInput);

				expect(result.isFail).toBe(true);
				expect(result.unwrapError.details).toMatchObject({
					id: expect.any(AppError),
					name: 'Name cannot be empty',
					country: 'Country cannot be empty',
					midpoint: expect.any(String),
				});
			});
		});
	});
});
