import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUserRepository } from '@/repositories/in-memory/prisma-users.repository';

import type { UserRepository } from '@/repositories/users-repository';
import { AuthenticatedUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

describe('GetUserProfileUseCase', () => {
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
	let userRepository: UserRepository;
	let sut: GetUserProfileUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		sut = new GetUserProfileUseCase(userRepository);
	});

	it('should throw ResourceNotFoundError when the user does not exist', async () => {
		const { email, name, password } = userInputData();
		const hashedPassword = await hash(password, 6);
		await userRepository.create({
			email,
			name,
			passwordHash: hashedPassword,
		});

		await expect(
			sut.execute({
				id: randomUUID(),
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return user data when user exists', async () => {
		const { email, name, password } = userInputData();
		const hashedPassword = await hash(password, 6);

		const user = await userRepository.create({
			email,
			name,
			passwordHash: hashedPassword,
		});

		const userAuthenticated = await sut.execute({
			id: user.id,
		});
		expect(userAuthenticated).toHaveProperty('user');
		expect(userAuthenticated.user).toHaveProperty('id', user.id);
		expect(userAuthenticated.user).toHaveProperty('email', user.email);
		expect(userAuthenticated.user).toHaveProperty('name', user.name);
	});
});
