export interface Coordinate {
	latitude: number;
	longitude: number;
}
const EARTH_RADIUS_KM = 6371;

function convertDegreesToRadians(degree: number): number {
	return (degree * Math.PI) / 180;
}

function getDeltaRadians(
	from: Coordinate,
	to: Coordinate,
): { deltaLat: number; deltaLon: number } {
	return {
		deltaLat: convertDegreesToRadians(to.latitude - from.latitude),
		deltaLon: convertDegreesToRadians(to.longitude - from.longitude),
	};
}

function haversineTerm(from: Coordinate, to: Coordinate): number {
	const { deltaLat, deltaLon } = getDeltaRadians(from, to);

	const fromLatRadian = convertDegreesToRadians(from.latitude);
	const toLatRadian = convertDegreesToRadians(to.latitude);

	return (
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(fromLatRadian) *
			Math.cos(toLatRadian) *
			Math.sin(deltaLon / 2) *
			Math.sin(deltaLon / 2)
	);
}

function getCentralAngle(haversineValue: number): number {
	return (
		2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))
	);
}

function convertRadiansToKilometers(centralAngle: number): number {
	return EARTH_RADIUS_KM * centralAngle;
}

export function getDistanceBetweenCoordinates(
	from: Coordinate,
	to: Coordinate,
): { kilometers: number; meters: number } {
	const haversineValue = haversineTerm(from, to);
	const centralAngle = getCentralAngle(haversineValue);

	const distanceInKilometers = convertRadiansToKilometers(centralAngle);
	const distanceInMeters = distanceInKilometers * 1000;

	return {
		kilometers: distanceInKilometers,
		meters: distanceInMeters,
	};
}
