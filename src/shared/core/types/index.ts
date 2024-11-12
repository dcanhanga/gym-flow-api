import type { Polygon } from '../value-object/polygon.js';

export type Context = Record<string, string>;
export type GeoPoint2d = { lat: number; lon: number };
export type GeoPoint2dTuple = [number, number];
export type PolygonError = {
	type:
		| 'InvalidCoordinate'
		| 'IntersectingEdges'
		| 'InvalidPolygon'
		| 'VertexCount'
		| 'SelfIntersection';
	message: string;
	details?: Record<string, unknown>;
};
