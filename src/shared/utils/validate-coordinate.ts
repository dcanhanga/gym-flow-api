export class ValidateCoordinate {
	public static validateLatitude(lat: number): boolean {
		return lat >= -90 && lat <= 90;
	}

	public static validateLongitude(lon: number): boolean {
		return lon >= -180 && lon <= 180;
	}
}
