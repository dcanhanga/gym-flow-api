import { BaseEntity } from '@/shared/core/entity/base-entity.js';
import type { AppError } from '@/shared/core/errors/app-error.js';
import type { ValidatorPort } from '@/shared/core/ports/validator.js';
import { Result } from '@/shared/core/utils/result.js';
import type { RegionInput, RegionProps } from '../types/region.js';
import { RegionValidator } from '../validators/region.js';

export class Region extends BaseEntity<RegionInput> {
	private readonly props: RegionProps;
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

	public static create(
		input: RegionInput,
		validator: ValidatorPort<RegionInput, RegionProps> = RegionValidator,
	): Result<Region, AppError> {
		const validationResult = validator.validate(input);
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
			polygon: this.polygonNested,
		};
	}
}
