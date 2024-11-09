import { randomUUID } from 'node:crypto';
import { BaseEntity } from '@/shared/core/entity/base-entity.js';
import type { Coordinate } from '@/shared/types/index.js';

export class Region extends BaseEntity<Region.Input> {
	id: string;
	name: string;
	country: string;
	midpoint: Coordinate;
	coordinates: Coordinate[];

	constructor(props: Region.Input) {
		super(props);
		this.id = props.id ?? randomUUID();
		this.name = props.name;
		this.country = props.country;
		this.midpoint = props.midpoint;
		this.coordinates = props.coordinates;
	}
	private validLat(lat: number): boolean {
		return lat >= -90 && lat <= 90;
	}
	private validLong(long: number): boolean {
		return long >= -180 && long <= 180;
	}
}

// Namespace para os tipos da Região
export namespace Region {
	export type Input = {
		id?: string;
		name: string;
		country: string;
		midpoint: Coordinate;
		coordinates: Coordinate[];
	};
	export type Output = {
		id: string;
		name: string;
		country: string;
		midpoint: Coordinate;
		coordinates: Coordinate[];
	};
}
