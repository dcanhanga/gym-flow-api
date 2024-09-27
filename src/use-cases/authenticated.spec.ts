import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUserRepository } from '@/repositories/in-memory/prisma-users.repository';

import type { UserRepository } from '@/repositories/users-repository';
import { AuthenticatedUseCase } from './authenticated';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticated UseCase', () => {
	const userInputData = () => ({
		email: faker.internet.email(),
		name: faker.internet.userName(),
		password: faker.internet.password(),
	});
	let userRepository: UserRepository;
	let sut: AuthenticatedUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		sut = new AuthenticatedUseCase(userRepository);
	});

	it('should not authenticate a user with invalid password', async () => {
		const { email, name, password } = userInputData();
		const hashedPassword = await hash(password, 6);
		await userRepository.create({
			email,
			name,
			passwordHash: hashedPassword,
		});

		await expect(
			sut.execute({
				email,
				password: userInputData().password,
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
	it('should not authenticate a user with invalid email', async () => {
		const { email, name, password } = userInputData();
		const hashedPassword = await hash(password, 6);

		await userRepository.create({
			email,
			name,
			passwordHash: hashedPassword,
		});

		await expect(
			sut.execute({
				email: userInputData().email,
				password,
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
	it('should be able to authenticate a user with valid credentials', async () => {
		const { email, name, password } = userInputData();
		const hashedPassword = await hash(password, 6);

		const user = await userRepository.create({
			email,
			name,
			passwordHash: hashedPassword,
		});

		const userAuthenticated = await sut.execute({
			email,
			password,
		});
		expect(userAuthenticated).toHaveProperty('user');
		expect(userAuthenticated.user).toHaveProperty('id', user.id);
		expect(userAuthenticated.user).toHaveProperty('email', user.email);
		expect(userAuthenticated.user).toHaveProperty('name', user.name);
	});
});
