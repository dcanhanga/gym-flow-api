import type { PolygonValidatorPort } from '../ports/polygon-validator.js';
import type { GeoPoint2d, PolygonError } from '../types/index.js';

export class PolygonIntersectionValidator implements PolygonValidatorPort {
	check(input: GeoPoint2d[]): PolygonError[] {
		const errors: PolygonError[] = [];
		const points = input;
		for (let i = 0; i < points.length - 1; i++) {
			for (let j = i + 1; j < points.length - 1; j++) {
				if (arePointsEqual(points[i], points[j])) {
					errors.push({
						type: 'IntersectingEdges',
						message: `Vértices duplicados encontrados nas posições ${i} e ${j}`,
						details: {
							point1: { index: i, ...points[i] },
							point2: { index: j, ...points[j] },
						},
					});
				}
			}
		}
		// Verificar auto-interseções
		const intersections = checkSelfIntersections(points);
		errors.push(...intersections);

		return errors;
	}
}

// Função auxiliar para comparar pontos
function arePointsEqual(
	p1: { lon: number; lat: number },
	p2: { lon: number; lat: number },
): boolean {
	const EPSILON = 1e-10;
	return (
		Math.abs(p1.lon - p2.lon) < EPSILON && Math.abs(p1.lat - p2.lat) < EPSILON
	);
}
// Função para verificar se dois segmentos se intersectam
function doSegmentsIntersect(
	p1: { lon: number; lat: number },
	p2: { lon: number; lat: number },
	p3: { lon: number; lat: number },
	p4: { lon: number; lat: number },
): boolean {
	// Converter para coordenadas x, y para facilitar os cálculos
	const line1 = {
		x1: p1.lon,
		y1: p1.lat,
		x2: p2.lon,
		y2: p2.lat,
	};
	const line2 = {
		x1: p3.lon,
		y1: p3.lat,
		x2: p4.lon,
		y2: p4.lat,
	};

	// Calcular denominador
	const den =
		(line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
		(line2.x2 - line2.x1) * (line1.y2 - line1.y1);

	if (den === 0) return false; // Linhas paralelas

	// Calcular ua e ub
	const ua =
		((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
			(line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
		den;
	const ub =
		((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
			(line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
		den;

	// Verificar se a interseção ocorre dentro dos segmentos
	return ua > 0 && ua < 1 && ub > 0 && ub < 1;
}

// Função para verificar auto-interseções
function checkSelfIntersections(
	points: Array<{ lon: number; lat: number }>,
): PolygonError[] {
	const errors: PolygonError[] = [];

	for (let i = 0; i < points.length - 1; i++) {
		for (let j = i + 2; j < points.length - 1; j++) {
			// Pular verificação entre o último e primeiro segmento
			if (i === 0 && j === points.length - 2) continue;

			if (
				doSegmentsIntersect(points[i], points[i + 1], points[j], points[j + 1])
			) {
				errors.push({
					type: 'SelfIntersection',
					message: `O polígono possui auto-interseção entre os segmentos ${i} e ${j}`,
					details: {
						segment1: { start: points[i], end: points[i + 1] },
						segment2: { start: points[j], end: points[j + 1] },
					},
				});
			}
		}
	}

	return errors;
}
