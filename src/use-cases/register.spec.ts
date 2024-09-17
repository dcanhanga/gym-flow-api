import { UserAlreadyExists } from '@/errors/user-already-exists-error';
import { InMemoryUserRepository } from '@/repositories/in-memory/prisma-users.repository';
import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';

describe('Register Use Case', () => {
	it('should be not able register with same email twice', async () => {
		const userRepository = new InMemoryUserRepository();
		const registerUseCase = new RegisterUseCase(userRepository);
		const email = 'jhondoe@gmail.com';
		await registerUseCase.execute({
			email,
			name: 'John Doe',
			password: '12345',
		});

		expect(() =>
			registerUseCase.execute({
				email,
				name: 'John Doe',
				password: '12345',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExists);
	});
	it('should be hashed password upon registration', async () => {
		const userRepository = new InMemoryUserRepository();
		const registerUseCase = new RegisterUseCase(userRepository);
		const email = 'jhondoe@gmail.com';
		const { user } = await registerUseCase.execute({
			email,
			name: 'John Doe',
			password: '12345',
		});
		const isPasswordHashedCorrectly = await compare('12345', user.passwordHash);
		expect(isPasswordHashedCorrectly).toBe(true);
	});
	it('should be able to register', async () => {
		const userRepository = new InMemoryUserRepository();
		const registerUseCase = new RegisterUseCase(userRepository);
		const email = 'jhondoe@gmail.com';
		const { user } = await registerUseCase.execute({
			email,
			name: 'John Doe',
			password: '12345',
		});
		expect(user.id).toEqual(expect.any(String));
	});
});