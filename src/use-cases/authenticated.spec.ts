import { hash } from 'bcryptjs';
import { describe, expect, it } from 'vitest';

import { InMemoryUserRepository } from '@/repositories/in-memory/prisma-users.repository';

import { AuthenticatedUseCase } from './authenticated';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticated UseCase', () => {
	it('should be able to authenticate a user with valid credentials', async () => {
		const userRepository = new InMemoryUserRepository();
		const sut = new AuthenticatedUseCase(userRepository);

		const password = '123456';
		const hashedPassword = await hash(password, 6);

		const user = await userRepository.create({
			email: 'johndoe@email.com',
			name: 'John Doe',
			passwordHash: hashedPassword,
		});

		const userAuthenticated = await sut.execute({
			email: user.email,
			password,
		});
		expect(userAuthenticated).toHaveProperty('user');
		expect(userAuthenticated.user).toHaveProperty('id', user.id);
		expect(userAuthenticated.user).toHaveProperty('email', user.email);
		expect(userAuthenticated.user).toHaveProperty('name', user.name);
	});
	it('should not authenticate a user with invalid password', async () => {
		const userRepository = new InMemoryUserRepository();
		const sut = new AuthenticatedUseCase(userRepository);

		const password = '123456';
		const hashedPassword = await hash(password, 6);

		await userRepository.create({
			email: 'johndoe@email.com',
			name: 'John Doe',
			passwordHash: hashedPassword,
		});

		await expect(
			sut.execute({
				email: 'johndoe@email.com',
				password: 'wrongpassword',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
	it('should not authenticate a user with invalid email', async () => {
		const userRepository = new InMemoryUserRepository();
		const sut = new AuthenticatedUseCase(userRepository);

		const password = '123456';
		const hashedPassword = await hash(password, 6);

		await userRepository.create({
			email: 'johndoe@email.com',
			name: 'John Doe',
			passwordHash: hashedPassword,
		});

		await expect(
			sut.execute({
				email: 'wrongEmail@email.com',
				password: password,
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
