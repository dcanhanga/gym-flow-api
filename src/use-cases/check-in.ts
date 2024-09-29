import type { CheckInRepository } from '@/repositories/check-in-repository';

import type { CheckIn } from '@prisma/client';

export class CheckInUseCase {
	constructor(private readonly checkInRepository: CheckInRepository) {}
	async execute(
		request: CheckInUseCaseTypes.Request,
	): Promise<CheckInUseCaseTypes.Response> {
		const { gymId, userId, validatedAt } = request;
		const checkInOnSameDate = await this.checkInRepository.findUserByIdOnDate(
			userId,
			new Date(),
		);
		if (checkInOnSameDate) {
			throw new Error();
		}
		const checkIn = await this.checkInRepository.create({
			gymId,
			userId,
			validatedAt,
		});
		return { checkIn };
	}
}

namespace CheckInUseCaseTypes {
	export type Request = {
		userId: string;
		gymId: string;
		validatedAt?: Date | null;
	};
	export type Response = { checkIn: CheckIn };
}
