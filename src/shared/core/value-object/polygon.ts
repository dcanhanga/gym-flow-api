import { httpStatusCode } from '../constants/http-status-code.js';
import { AppError } from '../errors/app-error.js';
import type { PolygonValidatorPort } from '../ports/polygon-validator.js';
import type {
	GeoPoint2d,
	GeoPoint2dTuple,
	PolygonError,
} from '../types/index.js';
import { Result } from '../utils/result.js';
import { PolygonClosureValidator } from '../validators/polygon-closure.js';
import { PolygonIntersectionValidator } from '../validators/polygon-intersection.js';
import { PolygonPointValidator } from '../validators/polygon-point.js';
import { PolygonVertexCountValidator } from '../validators/polygon-vertex-count.js';
import { ValueObject } from './value-object.js';

type PolygonInput = GeoPoint2d[];
export class Polygon extends ValueObject<PolygonInput> {
	private validationErrors: PolygonError[] = [];
	private validators: PolygonValidatorPort[];

	constructor(input: PolygonInput, validators: PolygonValidatorPort[]) {
		super(input);
		this.validators = validators;
	}
	private validateCoordinates(): void {
		for (const validator of this.validators) {
			const errors = validator.check(this.getInput);
			this.validationErrors.push(...errors);
		}
	}

	public static create(input: PolygonInput): Result<Polygon, AppError> {
		const validators: PolygonValidatorPort[] = [
			new PolygonPointValidator(),
			new PolygonIntersectionValidator(),
			new PolygonClosureValidator(),
			new PolygonVertexCountValidator(),
		];

		const polygon = new Polygon(input, validators);
		polygon.validateCoordinates();

		if (polygon.validationErrors.length) {
			const detail = polygon.validationErrors.map((error) => ({
				type: error.type,
				message: error.message,
				details: error.details,
			}));
			return Result.fail(
				new AppError(
					'Erro de validação de polígono',
					httpStatusCode.BAD_REQUEST,
					detail,
				),
			);
		}
		return Result.ok(polygon);
	}
	public get toNestedArray(): GeoPoint2dTuple[][] {
		return [this.input.map(({ lat, lon }) => [lat, lon])];
	}
	public get toFlatArray(): GeoPoint2dTuple[] {
		return this.input.map(({ lat, lon }) => [lat, lon]);
	}
}
