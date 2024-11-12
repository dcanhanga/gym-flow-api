import { httpStatusCode } from '@/shared/core/constants/http-status-code.js';
import { AppError } from '@/shared/core/errors/app-error.js';
import { Result } from '@/shared/core/utils/result.js';
import { Point } from '@/shared/core/value-object/point.js';
import { Polygon } from '@/shared/core/value-object/polygon.js';
import { UUID } from '@/shared/core/value-object/uuid.js';
import type { RegionInput, RegionProps } from '../types/region.js';

export class RegionValidator {
	public static validate(input: RegionInput): Result<RegionProps, AppError> {
		const validationErrors: Record<string, unknown> = {};
		const { country, midpoint, name, polygon: polygonInput, id } = input;

		const idResult = UUID.create(id);
		console.log({ idResult, id });
		if (idResult.isFail) {
			validationErrors.id = idResult.unwrapError;
		}
		if (country.trim().length === 0) {
			validationErrors.country = 'Country cannot be empty';
		}
		if (name.trim().length === 0) {
			validationErrors.name = 'Name cannot be empty';
		}
		const midpointResult = Point.create(midpoint);
		if (midpointResult.isFail) {
			validationErrors.midpoint = midpointResult.unwrapError.message;
		}
		const polygonResult = Polygon.create(polygonInput);
		if (polygonResult.isFail) {
			validationErrors.polygon = polygonResult.unwrapError.message;
		}
		if (Object.keys(validationErrors).length > 0) {
			return Result.fail(
				new AppError(
					'Region validation error',
					httpStatusCode.BAD_REQUEST,
					validationErrors,
				),
			);
		}

		return Result.ok({
			id: idResult.unwrap,
			name: name.trim(),
			country: country.trim(),
			midpoint: midpointResult.unwrap,
			polygon: polygonResult.unwrap,
		});
	}
}
