export class GeoPoint2dValidator {
	public static checkLatitude(lat: number): boolean {
		return lat >= -90 && lat <= 90;
	}

	public static checkLongitude(lon: number): boolean {
		return lon >= -180 && lon <= 180;
	}
}
