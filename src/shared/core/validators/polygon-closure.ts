import type { PolygonValidatorPort } from '../ports/polygon-validator.js';
import type { GeoPoint2d, PolygonError } from '../types/index.js';

export class PolygonClosureValidator implements PolygonValidatorPort {
	check(input: GeoPoint2d[]): PolygonError[] {
		const errors: PolygonError[] = [];
		const [firstCoordinate] = input;
		const lastCoordinate = input[input.length - 1];
		if (
			firstCoordinate.lat !== lastCoordinate.lat ||
			firstCoordinate.lon !== lastCoordinate.lon
		) {
			errors.push({
				type: 'InvalidPolygon',
				message:
					'O polígono não está fechado. O último ponto deve ser o mesmo que o primeiro.',
				details: { firstCoordinate, lastCoordinate },
			});
		}
		return errors;
	}
}
