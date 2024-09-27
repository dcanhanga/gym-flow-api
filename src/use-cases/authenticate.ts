import type { UserRepository } from '@/repositories/users-repository';
import type { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

export class AuthenticatedUseCase {
	constructor(private readonly userRepository: UserRepository) {}
	async execute(
		request: AuthenticatedUseCaseTypes.Request,
	): Promise<AuthenticatedUseCaseTypes.Response> {
		const { email, password } = request;
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new InvalidCredentialsError();
		}
		const doesPasswordMatch = await compare(password, user.passwordHash);
		if (!doesPasswordMatch) {
			throw new InvalidCredentialsError();
		}
		return { user };
	}
}

namespace AuthenticatedUseCaseTypes {
	export type Request = {
		email: string;
		password: string;
	};
	export type Response = { user: User };
}
