import type { CheckInRepository } from '@/repositories/check-in-repository';

import type { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

export class ValidateCheckInUseCase {
	constructor(private readonly checkInRepository: CheckInRepository) {}

	async execute(
		request: ValidateCheckInUseCaseTypes.Request,
	): Promise<ValidateCheckInUseCaseTypes.Response> {
		const { CheckInId } = request;

		const checkIn = await this.checkInRepository.findById(CheckInId);
		if (!checkIn) {
			throw new ResourceNotFoundError();
		}
		checkIn.validatedAt = new Date();
		this.checkInRepository.save(checkIn);
		return { checkIn };
	}
}

namespace ValidateCheckInUseCaseTypes {
	export type Request = {
		CheckInId: string;
	};

	export type Response = {
		checkIn: CheckIn;
	};
}
