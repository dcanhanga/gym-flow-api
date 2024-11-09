export abstract class ValueObject<T> {
	protected readonly input: T;
	constructor(input: T) {
		this.input = Object.freeze(input);
	}
	public equals(vo?: ValueObject<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}
		return JSON.stringify(this.input) === JSON.stringify(vo.input);
	}
	public get gateValue() {
		return this.input;
	}
}
