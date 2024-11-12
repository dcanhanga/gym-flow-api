import type { GeoPoint2d, PolygonError } from '../types/index.js';

export interface PolygonValidatorPort {
	check(input: GeoPoint2d[]): PolygonError[];
}
