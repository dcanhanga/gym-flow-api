import { randomUUID } from 'node:crypto';
import { getDistanceBetweenCoordinates } from '@/utils/ get-distance-between-coordinate';
import { type Gym, Prisma } from '@prisma/client';
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
			latitude: new Prisma.Decimal(latitude.toString()),
			longitude: new Prisma.Decimal(longitude.toString()),
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
	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}
	async findManyNearby(params: {
		latitude: number;
		longitude: number;
	}): Promise<Gym[]> {
		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{
					latitude: item.latitude.toNumber(),
					longitude: item.longitude.toNumber(),
				},
			);

			return distance.kilometers < 10;
		});
	}
}
