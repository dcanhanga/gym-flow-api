import type { Coordinate } from '@/shared/core/types/index.js';
import type { Point } from '@/shared/core/value-object/point.js';
import type { Polygon } from '@/shared/core/value-object/polygon.js';
import type { UUID } from '@/shared/core/value-object/uuid.js';

export type RegionInput = {
	id?: string;
	name: string;
	country: string;
	midpoint: Coordinate;
	polygon: Coordinate[];
};

export type RegionProps = {
	id: UUID;
	name: string;
	country: string;
	midpoint: Point;
	polygon: Polygon;
};
