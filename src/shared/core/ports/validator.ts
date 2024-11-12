import type { AppError } from '../errors/app-error.js';
import type { Result } from '../utils/result.js';

export interface ValidatorPort<TInput, TProps> {
	validate(input: TInput): Result<TProps, AppError>;
}
