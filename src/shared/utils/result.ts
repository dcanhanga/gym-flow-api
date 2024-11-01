export class Result<T, E = Error> {
	private constructor(
		private readonly isSuccess: boolean,
		private readonly value: T | null,
		private readonly error: E | null,
	) {}

	static ok<T>(value: T): Result<T, Error> {
		return new Result<T, Error>(true, value, null);
	}
	static fail<E>(error: E): Result<never, E> {
		return new Result<never, E>(false, null as never, error);
	}
	public isOk(): boolean {
		return this.isSuccess;
	}

	public isFail(): boolean {
		return !this.isSuccess;
	}

	public unwrap(): T {
		if (!this.isSuccess || this.value === null) {
			throw this.error;
		}
		return this.value;
	}

	public unwrapError(): E {
		if (this.isSuccess || this.error === null) {
			throw new Error('Cannot get error from success result');
		}
		return this.error;
	}
}
