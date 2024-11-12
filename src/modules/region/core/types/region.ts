import type { GeoPoint2d } from '@/shared/core/types/index.js';
import type { Point } from '@/shared/core/value-object/point.js';
import type { Polygon } from '@/shared/core/value-object/polygon.js';

import type { UUID } from '@/shared/core/value-object/uuid.js';

export type RegionInput = {
	id?: string;
	name: string;
	country: string;
	midpoint: GeoPoint2d;
	polygon: GeoPoint2d[];
};

export type RegionProps = {
	id: UUID;
	name: string;
	country: string;
	midpoint: Point;
	polygon: Polygon;
};

export type RegisterRegionInput = Omit<RegionInput, 'id'>;
export type RegisterRegionOutput = {
	id: string;
	name: string;
};
