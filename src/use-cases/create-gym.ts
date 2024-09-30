import type { GymRepository } from '@/repositories/gyms-repository';
import type { Gym } from '@prisma/client';

export class CreateGymUseCase {
	constructor(private gymRepository: GymRepository) {}
	async execute(
		inputData: CreateGymUseCaseTypes.Request,
	): Promise<CreateGymUseCaseTypes.Response> {
		const { description, latitude, longitude, title, phone } = inputData;
		const gym = await this.gymRepository.create({
			description,
			latitude,
			longitude,
			title,
			phone,
		});
		return { gym };
	}
}
namespace CreateGymUseCaseTypes {
	export type Request = {
		title: string;
		description: string | null;
		phone: string;
		latitude: number;
		longitude: number;
	};

	export type Response = {
		gym: Gym;
	};
}
