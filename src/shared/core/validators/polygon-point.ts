import type { PolygonValidatorPort } from '../ports/polygon-validator.js';
import type { GeoPoint2d, PolygonError } from '../types/index.js';
import { GeoPoint2dValidator } from './geo-point2d.js';

export class PolygonPointValidator implements PolygonValidatorPort {
	check(input: GeoPoint2d[]): PolygonError[] {
		const errors: PolygonError[] = [];
		input.forEach((coord, index) => {
			const { lon, lat } = coord;
			if (!GeoPoint2dValidator.checkLatitude(lat)) {
				errors.push({
					type: 'InvalidCoordinate',
					message: `Latitude inválida: ${lat}. Deve estar entre -90 e 90.`,
					details: { index, coordinate: { lat, lon } },
				});
			}
			if (!GeoPoint2dValidator.checkLongitude(lon)) {
				errors.push({
					type: 'InvalidCoordinate',
					message: `Longitude inválida: ${lon}. Deve estar entre -180 e 180.`,
					details: { index, coordinate: { lat, lon } },
				});
			}
		});
		return errors;
	}
}
