import type { CheckInRepository } from '@/repositories/check-in-repository';

export class GetUserMetricsUseCase {
	constructor(private readonly checkInRepository: CheckInRepository) {}

	async execute(
		inputData: GetUserMetricsUseCaseTypes.Request,
	): Promise<GetUserMetricsUseCaseTypes.Response> {
		const { userId } = inputData;

		const checkInsCount = await this.checkInRepository.countByUserId(userId);
		return { checkInsCount };
	}
}

namespace GetUserMetricsUseCaseTypes {
	export type Request = {
		userId: string;
	};

	export type Response = {
		checkInsCount: number;
	};
}
