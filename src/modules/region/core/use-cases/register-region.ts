import { AppError } from '@/shared/core/errors/app-error.js';
import { Result } from '@/shared/core/utils/result.js';
import type {
	RegisterRegionPorts,
	RegisterRegionValidador,
} from '../ports/region.js';
import type {
	RegisterRegionInput,
	RegisterRegionOutput,
} from '../types/region.js';

export class RegisterRegionUseCase implements RegisterRegionPorts {
	constructor(private readonly validator: RegisterRegionValidador) {}
	async register(
		input: RegisterRegionInput,
	): Promise<Result<RegisterRegionOutput, AppError>> {
		const validatorResult = this.validator.check(input);
		if (validatorResult.isFail) {
			return Result.fail(validatorResult.unwrapError);
		}

		return Result.fail(new AppError('', 500));
	}
}
