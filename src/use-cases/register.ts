import { UserAlreadyExists } from '@/errors/user-already-exists-error';
import type { UserRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';

type RegisterRequest = {
	name: string;
	email: string;
	password: string;
};

export class RegisterUseCase {
	constructor(private userRepository: UserRepository) {}
	async execute(registerRequest: RegisterRequest): Promise<void> {
		const { email, name, password } = registerRequest;
		const userWithSameEmail = await this.userRepository.findByEmail(email);
		if (userWithSameEmail) {
			throw new UserAlreadyExists();
		}
		const passwordHash = await hash(password, 6);

		await this.userRepository.create({ email, name, passwordHash });
	}
}
