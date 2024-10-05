import type { CheckInRepository } from '@/repositories/check-in-repository';

import type { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { ExpiredCheckInError } from './errors/expired-check-in-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

export class ValidateCheckInUseCase {
	constructor(private readonly checkInRepository: CheckInRepository) {}

	async execute(
		request: ValidateCheckInUseCaseTypes.Request,
	): Promise<ValidateCheckInUseCaseTypes.Response> {
		const { checkInId } = request;

		const checkIn = await this.checkInRepository.findById(checkInId);
		if (!checkIn) {
			throw new ResourceNotFoundError();
		}
		const minutesSinceCheckIn = dayjs(new Date()).diff(
			checkIn.createdAt,
			'minutes',
		);
		if (minutesSinceCheckIn > 20) {
			throw new ExpiredCheckInError();
		}
		checkIn.validatedAt = new Date();
		this.checkInRepository.save(checkIn);
		return { checkIn };
	}
}

namespace ValidateCheckInUseCaseTypes {
	export type Request = {
		checkInId: string;
	};

	export type Response = {
		checkIn: CheckIn;
	};
}
