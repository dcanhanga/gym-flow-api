import { httpStatusCode } from '@/shared/constants/http-status-code.js';
import { AppError } from '@/shared/errors/app-error.js';
import type { Coordinate } from '@/shared/types/index.js';
import { Result } from '@/shared/utils/result.js';
import { ValidateCoordinate } from '@/shared/utils/validate-coordinate.js';
import { ValueObject } from './value-object.js';

type Coordinates = [number, number];
type PolygonInput = Coordinate[];

export class Polygon extends ValueObject<PolygonInput> {
	private readonly validationErrors: Record<number, string[]> = {};

	private constructor(input: PolygonInput) {
		super(input);
	}

	private validateSingleCoordinate(coord: Coordinate, index: number): void {
		const { lon, lat } = coord;
		const errors = [
			!ValidateCoordinate.validateLatitude(lat) &&
				`Latitude inválida: ${lat}. Deve estar entre -90 e 90.`,
			!ValidateCoordinate.validateLongitude(lon) &&
				`Longitude inválida: ${lon}. Deve estar entre -180 e 180.`,
		].filter(Boolean) as string[];

		if (errors.length) this.validationErrors[index] = errors;
	}

	private validateCoordinates(): void {
		this.input.forEach((coord, index) =>
			this.validateSingleCoordinate(coord, index),
		);
		this.validatePolygonClosure();
	}

	private validatePolygonClosure(): void {
		if (!this.isPolygonClosed()) {
			this.validationErrors[this.input.length - 1] = [
				'O polígono não está fechado. O último ponto deve ser o mesmo que o primeiro.',
			];
		}
	}

	private isPolygonClosed(): boolean {
		const [firstCoordinate] = this.input;
		const lastCoordinate = this.input[this.input.length - 1];
		return (
			firstCoordinate.lat === lastCoordinate.lat &&
			firstCoordinate.lon === lastCoordinate.lon
		);
	}

	public static create(input: PolygonInput): Result<Polygon, AppError> {
		const polygon = new Polygon(input);
		polygon.validateCoordinates();

		if (Object.keys(polygon.validationErrors).length) {
			return Result.fail(
				new AppError(
					'Erro de validação de polígono',
					httpStatusCode.BAD_REQUEST,
					polygon.validationErrors,
				),
			);
		}

		return Result.ok(polygon);
	}

	public get toNestedArray(): Coordinates[][] {
		return [this.input.map(({ lat, lon }) => [lat, lon])];
	}

	public get toFlatArray(): Coordinates[] {
		return this.input.map(({ lat, lon }) => [lat, lon]);
	}
}
