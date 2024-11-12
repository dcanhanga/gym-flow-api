import type { AppError } from '@/shared/core/errors/app-error.js';
import type { Result } from '@/shared/core/utils/result.js';
import type {
	RegisterRegionInput,
	RegisterRegionOutput,
} from '../types/region.js';

export interface RegisterRegionPorts {
	register(
		input: RegisterRegionInput,
	): Promise<Result<RegisterRegionOutput, AppError>>;
}
export interface RegisterRegionValidador {
	check(input: Record<string, unknown>): Result<RegisterRegionInput, AppError>;
}
