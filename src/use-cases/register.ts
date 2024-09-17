import { UserAlreadyExists } from '@/errors/user-already-exists-error';
import type { UserRepository } from '@/repositories/users-repository';
import type { User } from '@prisma/client';
import { hash } from 'bcryptjs';

type RegisterUseCaseRequest = {
	name: string;
	email: string;
	password: string;
};

type RegisterUseCaseResponse = {
	user: User;
};
export class RegisterUseCase {
	constructor(private userRepository: UserRepository) {}
	async execute(
		registerRequest: RegisterUseCaseRequest,
	): Promise<RegisterUseCaseResponse> {
		const { email, name, password } = registerRequest;
		const userWithSameEmail = await this.userRepository.findByEmail(email);
		if (userWithSameEmail) {
			throw new UserAlreadyExists();
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
