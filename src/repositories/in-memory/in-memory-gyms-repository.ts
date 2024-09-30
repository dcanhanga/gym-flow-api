import { randomUUID } from 'node:crypto';
import type { Gym, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import type { GymRepository } from '../gyms-repository';

export class InMemoryGyRepository implements GymRepository {
	private items: Gym[] = [];
	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const { latitude, longitude, phone, title, description } = data;
		const gym: Gym = {
			id: randomUUID(),
			title,
			phone,
			description: description ? description : null,
			latitude:
				typeof latitude === 'number' ? new Decimal(latitude) : new Decimal(0),
			longitude:
				typeof longitude === 'number' ? new Decimal(longitude) : new Decimal(0),
		};
		this.items.push(gym);
		return gym;
	}
	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((gym) => gym.id === id);
		if (!gym) {
			return null;
		}
		return gym;
	}
}
