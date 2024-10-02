import type { CheckInRepository } from '@/repositories/check-in-repository';
import type { CheckIn } from '@prisma/client';

export class FetchUserCheckInsUseCase {
	constructor(private readonly checkInRepository: CheckInRepository) {}

	async execute(
		inputData: FetchUserCheckInsUseCaseTypes.Request,
	): Promise<FetchUserCheckInsUseCaseTypes.Response> {
		const { userId, page } = inputData;

		const checkIns = await this.checkInRepository.findManyByUserId(
			userId,
			page,
		);
		return { checkIns };
	}
}

namespace FetchUserCheckInsUseCaseTypes {
	export type Request = {
		userId: string;
		page: number;
	};

	export type Response = {
		checkIns: CheckIn[];
	};
}
