import type { PolygonValidatorPort } from '../ports/polygon-validator.js';
import type { GeoPoint2d, PolygonError } from '../types/index.js';

export class PolygonVertexCountValidator implements PolygonValidatorPort {
	check(input: GeoPoint2d[]): PolygonError[] {
		const errors: PolygonError[] = [];
		const uniqueCoordinates = new Set(
			input.map(({ lat, lon }) => `${lat},${lon}`),
		);
		if (uniqueCoordinates.size < 3) {
			errors.push({
				type: 'VertexCount',
				message: 'O polígono precisa ter pelo menos três vértices distintos.',
				details: { uniqueCoordinates: Array.from(uniqueCoordinates) },
			});
		}
		return errors;
	}
}
