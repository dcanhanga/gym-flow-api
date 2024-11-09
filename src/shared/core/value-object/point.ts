import { messages } from '@/shared/constants/messages.js';
import { AppError } from '@/shared/errors/app-error.js';
import type { Coordinate } from '@/shared/types/index.js';
import { Result } from '@/shared/utils/result.js';
import { ValidateCoordinate } from '@/shared/utils/validate-coordinate.js';
import { ValueObject } from './value-object.js';

type PointInput = Coordinate;
export class Point extends ValueObject<PointInput> {
	private constructor(input: PointInput) {
		super(input);
	}

	private validate(): boolean {
		const { lat, lon } = this.input;
		return (
			ValidateCoordinate.validateLatitude(lat) &&
			ValidateCoordinate.validateLongitude(lon)
		);
	}

	public static create(input: PointInput): Result<Point, AppError> {
		const point = new Point(input);

		if (!point.validate()) {
			const { lat, lon } = input;
			const errorDetails = {
				message: 'Coordenadas inválidas',
				details: {
					latitude: messages.INVALID_LATITUDE_PROVIDED.replace(
						'value',
						`${lat}`,
					),
					longitude: messages.INVALID_LONGITUDE_PROVIDED.replace(
						'value',
						`${lon}`,
					),
				},
			};
			return Result.fail(
				new AppError('Erro de validação de ponto', 400, errorDetails),
			);
		}

		return Result.ok(point);
	}
	public get toArray(): [number, number] {
		return [this.input.lat, this.input.lon];
	}
}
