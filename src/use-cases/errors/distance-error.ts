export class DistanceError extends Error {
	constructor() {
		super('Você está muito longe do gym.');
		this.name = 'DistanceError';
	}
}
