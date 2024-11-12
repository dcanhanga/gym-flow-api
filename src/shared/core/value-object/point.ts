import { messages } from '@/shared/core/constants/messages.js';
import { AppError } from '@/shared/core/errors/app-error.js';
import type { GeoPoint2d, GeoPoint2dTuple } from '@/shared/core/types/index.js';
import { Result } from '@/shared/core/utils/result.js';
import { GeoPoint2dValidator } from '@/shared/core/validators/geo-point2d.js';
import { ValueObject } from './value-object.js';

export class Point extends ValueObject<GeoPoint2d> {
	private constructor(input: GeoPoint2d) {
		super(input);
	}

	private validate(): boolean {
		const { lat, lon } = this.input;
		return (
			GeoPoint2dValidator.checkLatitude(lat) &&
			GeoPoint2dValidator.checkLongitude(lon)
		);
	}

	public static create(input: GeoPoint2d): Result<Point, AppError> {
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
	public get toArray(): GeoPoint2dTuple {
		return [this.input.lat, this.input.lon];
	}
	public get getValue() {
		return this.input;
	}
}
