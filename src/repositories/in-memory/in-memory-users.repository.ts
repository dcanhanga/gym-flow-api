import { randomUUID } from 'node:crypto';
import type { Prisma, User } from '@prisma/client';
import type { UserRepository } from '../users-repository';

export class InMemoryUserRepository implements UserRepository {
	private table: User[] = [];
	async findByEmail(email: string): Promise<User | null> {
		const user = this.table.find((user) => user.email === email);
		if (!user) {
			return null;
		}
		return user;
	}
	async findById(id: string): Promise<User | null> {
		const user = this.table.find((user) => user.id === id);
		if (!user) {
			return null;
		}
		return user;
	}
	async create(data: Prisma.UserCreateInput): Promise<User> {
		const user: User = {
			id: randomUUID(),
			email: data.email,
			name: data.name,
			passwordHash: data.passwordHash,
			createdAt: new Date(),
		};
		this.table.push(user);
		return user;
	}
}
