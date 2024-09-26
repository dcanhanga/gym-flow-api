import { hash } from 'bcryptjs';

import type { UserRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import type { User } from '@prisma/client';

export class RegisterUseCase {
	constructor(private userRepository: UserRepository) {}
	async execute(
		registerRequest: RegisterUseCaseTypes.Request,
	): Promise<RegisterUseCaseTypes.Response> {
		const { email, name, password } = registerRequest;
		const userWithSameEmail = await this.userRepository.findByEmail(email);
		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}
		const passwordHash = await hash(password, 6);

		const user = await this.userRepository.create({
			email,
			name,
			passwordHash,
		});
		return { user };
	}
}

namespace RegisterUseCaseTypes {
	export type Request = {
		name: string;
		email: string;
		password: string;
	};

	export type Response = {
		user: User;
	};
}
