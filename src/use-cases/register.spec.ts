import { faker } from '@faker-js/faker';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUserRepository } from '@/repositories/in-memory/prisma-users.repository';
import type { UserRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { RegisterUseCase } from './register';

describe('Register Use Case', () => {
	type UserFakeData = {
		email: string;
		name: string;
		password: string;
	};
	const userInputData = (): UserFakeData => ({
		email: faker.internet.email(),
		name: faker.internet.userName(),
		password: faker.internet.password(),
	});
	let sut: RegisterUseCase;
	let userRepository: UserRepository;
	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		sut = new RegisterUseCase(userRepository);
	});
	it('should not be possible to register with the same email twice', async () => {
		const data = userInputData();
		await sut.execute(data);

		await expect(() => sut.execute(data)).rejects.toBeInstanceOf(
			UserAlreadyExistsError,
		);
	});
	it('must register user with hashed password', async () => {
		const { email, name, password } = userInputData();
		const { user } = await sut.execute({
			email,
			name,
			password,
		});
		const isPasswordHashedCorrectly = await compare(
			password,
			user.passwordHash,
		);
		expect(isPasswordHashedCorrectly).toBe(true);
	});
	it('should be able to register', async () => {
		const { user } = await sut.execute(userInputData());
		expect(user.id).toEqual(expect.any(String));
	});
});
