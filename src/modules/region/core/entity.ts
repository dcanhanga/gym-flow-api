import { httpStatusCode } from '@/shared/constants/http-status-code.js';
import { BaseEntity } from '@/shared/core/entity/base-entity.js';
import { Point } from '@/shared/core/value-object/point.js';
import { Polygon } from '@/shared/core/value-object/polygon.js';
import { UUID } from '@/shared/core/value-object/uuid.js';
import { AppError } from '@/shared/errors/app-error.js';
import type { Coordinate } from '@/shared/types/index.js';
import { Result } from '@/shared/utils/result.js';

type RegionProps = {
	id: UUID;
	name: string;
	country: string;
	midpoint: Point;
	polygon: Polygon;
};

type RegionInput = {
	id?: string;
	name: string;
	country: string;
	midpoint: Coordinate;
	polygon: Coordinate[];
};

export class Region extends BaseEntity<RegionInput> {
	private readonly props: RegionProps;
	private validationErrors: Record<string, unknown> = {};

	private constructor(input: RegionInput, props: RegionProps) {
		super(input);
		this.props = props;
	}
	public get id() {
		return this.props.id.getValue;
	}
	public get name(): string {
		return this.props.name;
	}
	public get country(): string {
		return this.props.country;
	}
	public get midpoint(): [number, number] {
		return this.props.midpoint.toArray;
	}
	public get polygonNested(): [number, number][][] {
		return this.props.polygon.toNestedArray;
	}
	public get polygonFlat(): [number, number][] {
		return this.props.polygon.toFlatArray;
	}

	public static create(input: RegionInput): Result<Region, AppError> {
		const validationResult = RegionValidator.validate(input);
		if (validationResult.isFail) {
			return Result.fail(validationResult.unwrapError);
		}
		const props = validationResult.unwrap;
		const region = new Region(input, props);
		return Result.ok(region);
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.name,
			country: this.country,
			midpoint: this.midpoint,
			polygon: this.polygonFlat,
		};
	}
}

class RegionValidator {
	public static validate(input: RegionInput): Result<RegionProps, AppError> {
		const validationErrors: Record<string, unknown> = {};
		const { country, midpoint, name, polygon: polygonInput, id } = input;
		const idResult = UUID.create(id);
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
