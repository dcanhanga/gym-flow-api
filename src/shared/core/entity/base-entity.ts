export abstract class BaseEntity<T> {
	protected readonly input: T;

	constructor(input: T) {
		this.input = Object.freeze(input);
	}

	public equals(vo?: BaseEntity<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		return JSON.stringify(this.input) === JSON.stringify(vo.input);
	}
}
