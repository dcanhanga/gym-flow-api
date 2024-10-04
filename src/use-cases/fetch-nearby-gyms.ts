import type { GymRepository } from '@/repositories/gyms-repository';
import type { Gym } from '@prisma/client';

export class FetchNearbyGymsUseCase {
	constructor(private readonly gymRepository: GymRepository) {}

	async execute(
		inputData: FetchNearbyGymsUseCaseTypes.Request,
	): Promise<FetchNearbyGymsUseCaseTypes.Response> {
		const { userLatitude, userLongitude } = inputData;

		const gyms = await this.gymRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		});
		return { gyms };
	}
}

namespace FetchNearbyGymsUseCaseTypes {
	export type Request = {
		userLatitude: number;
		userLongitude: number;
	};

	export type Response = {
		gyms: Gym[];
	};
}
