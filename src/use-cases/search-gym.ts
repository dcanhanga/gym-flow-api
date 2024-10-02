import type { GymRepository } from '@/repositories/gyms-repository';
import type { Gym } from '@prisma/client';

export class SearchGymCase {
	constructor(private gymRepository: GymRepository) {}
	async execute(
		inputData: SearchGymCaseTypes.Request,
	): Promise<SearchGymCaseTypes.Response> {
		const { page, query } = inputData;
		const gyms = await this.gymRepository.searchMany(query, page);
		return { gyms };
	}
}
namespace SearchGymCaseTypes {
	export type Request = {
		query: string;
		page: number;
	};

	export type Response = {
		gyms: Gym[];
	};
}
