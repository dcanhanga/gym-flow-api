import type { CheckInRepository } from '@/repositories/check-in-repository';
import type { GymRepository } from '@/repositories/gyms-repository';

import { getDistanceBetweenCoordinates } from '@/utils/ get-distance-between-coordinate';
import type { CheckIn } from '@prisma/client';

import { DistanceError } from './errors/distance-error';
import { DuplicateCheckInError } from './errors/duplicate-check-in-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

export class CheckInUseCase {
	constructor(
		private readonly checkInRepository: CheckInRepository,
		private readonly gymsRepository: GymRepository,
	) {}

	async execute(
		request: CheckInUseCaseTypes.Request,
	): Promise<CheckInUseCaseTypes.Response> {
		const { gymId, userId, validatedAt, userLatitude, userLongitude } = request;

		const gym = await this.gymsRepository.findById(gymId);
		if (!gym) {
			throw new ResourceNotFoundError();
		}

		const checkInOnSameDate = await this.checkInRepository.findUserByIdOnDate(
			userId,
			new Date(),
		);
		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{ latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
		);
		const MAX_DISTANCE_IN_METERS = 100;

		if (distance.meters > MAX_DISTANCE_IN_METERS) {
			throw new DistanceError();
		}

		if (checkInOnSameDate) {
			throw new DuplicateCheckInError();
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
		userLatitude: number;
		userLongitude: number;
	};

	export type Response = {
		checkIn: CheckIn;
	};
}
