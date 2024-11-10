import type { AppError } from '../errors/app-error.js';

export class Result<T, E = Error> {
	private constructor(
		private readonly isSuccess: boolean,
		private readonly value: T | null = null,
		private readonly error: E | null = null,
	) {}
	static ok<T, E = AppError>(value: T): Result<T, E> {
		return new Result<T, E>(true, value, null);
	}
	static fail<E>(error: E): Result<never, E> {
		return new Result<never, E>(false, null, error);
	}

	public get isOk(): boolean {
		return this.isSuccess;
	}
	public get isFail(): boolean {
		return !this.isSuccess;
	}
	public get unwrap(): T {
		if (!this.isSuccess || this.value === null) {
			throw this.error;
		}
		return this.value;
	}
	public get unwrapError(): E {
		if (this.isSuccess || this.error === null) {
			throw new Error('Cannot get error from success result');
		}
		return this.error;
	}
}
