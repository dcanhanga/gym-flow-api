import type { UserRepository } from '@/repositories/users-repository';
import type { User } from '@prisma/client';

import { ResourceNotFoundError } from './errors/resource-not-found-error';

export class GetUserProfileUseCase {
	constructor(private readonly userRepository: UserRepository) {}
	async execute(
		request: GetUserProfileUseCaseTypes.Request,
	): Promise<GetUserProfileUseCaseTypes.Response> {
		const { id } = request;
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new ResourceNotFoundError();
		}

		return { user };
	}
}

namespace GetUserProfileUseCaseTypes {
	export type Request = {
		id: string;
	};
	export type Response = { user: User };
}
