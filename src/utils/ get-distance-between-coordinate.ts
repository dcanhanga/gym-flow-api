/**
 * Representa uma coordenada geográfica com latitude e longitude.
 */
export interface Coordinate {
	latitude: number; // Latitude da coordenada geográfica.
	longitude: number; // Longitude da coordenada geográfica.
}

/**
 * Calcula a distância entre duas coordenadas geográficas usando a fórmula de Haversine.
 *
 * A fórmula de Haversine é uma fórmula que calcula a distância entre dois pontos na superfície de uma esfera,
 * dadas suas longitudes e latitudes. Para mais informações, consulte:
 * [Fórmula de Haversine - Wikipedia](https://pt.wikipedia.org/wiki/F%C3%B3rmula_de_Haversine)
 *
 * @param {Coordinate} from - O ponto de origem com latitude e longitude.
 * @param {Coordinate} to - O ponto de destino com latitude e longitude.
 * @returns {{ kilometers: number, meters: number }} - A distância em quilômetros e metros entre os dois pontos.
 *
 * @example
 * const from = { latitude: -8.839988, longitude: 13.289437 }; // Luanda, Angola
 * const to = { latitude: -6.769183, longitude: 39.241711 };   // Zanzibar, Tanzânia
 * const distance = getDistanceBetweenCoordinates(from, to);
 * console.log(distance.kilometers); // Exibe a distância em km
 * console.log(distance.meters);      // Exibe a distância em metros
 */
export function getDistanceBetweenCoordinates(
	from: Coordinate,
	to: Coordinate,
): { kilometers: number; meters: number } {
	const EARTH_RADIUS_KM = 6371; // Raio da Terra em km

	// Converter coordenadas de graus para radianos
	const fromLatRadian = (Math.PI * from.latitude) / 180;
	const toLatRadian = (Math.PI * to.latitude) / 180;
	const deltaLatRadian = ((to.latitude - from.latitude) * Math.PI) / 180;
	const deltaLonRadian = ((to.longitude - from.longitude) * Math.PI) / 180;

	/**
	 * Cálculo do termo haversine para a diferença de latitude e longitude.
	 * Isso mede a "distância angular" entre os dois pontos.
	 */
	const haversineTerm =
		Math.sin(deltaLatRadian / 2) * Math.sin(deltaLatRadian / 2) +
		Math.cos(fromLatRadian) *
			Math.cos(toLatRadian) *
			Math.sin(deltaLonRadian / 2) *
			Math.sin(deltaLonRadian / 2);

	/**
	 * Distância angular em radianos entre os dois pontos na superfície da Terra.
	 * O valor é convertido usando a função atan2 para garantir maior precisão.
	 */
	const centralAngle =
		2 * Math.atan2(Math.sqrt(haversineTerm), Math.sqrt(1 - haversineTerm));

	// Distância final em quilômetros, multiplicando pelo raio da Terra.
	const distanceInKilometers = EARTH_RADIUS_KM * centralAngle;
	const distanceInMeters = distanceInKilometers * 1000; // Converter km para m

	return {
		kilometers: distanceInKilometers,
		meters: distanceInMeters,
	};
}
