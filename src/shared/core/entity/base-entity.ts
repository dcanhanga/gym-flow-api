export abstract class BaseEntity<T> {
	protected readonly props: T;

	constructor(props: T) {
		this.props = Object.freeze(props);
	}

	public equals(vo?: BaseEntity<T>): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		return JSON.stringify(this.props) === JSON.stringify(vo.props);
	}
}
