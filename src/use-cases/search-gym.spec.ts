import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import type { GymRepository } from '@/repositories/gyms-repository';
import { InMemoryGyRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymCase } from './search-gym';

describe('SearchGymUseCase', () => {
	type GymFakeData = {
		id?: string;
		description: string | null;
		latitude: number;
		longitude: number;
		phone: string;
		title: string;
	};

	const createGymFakeData = (): GymFakeData => ({
		id: randomUUID(),
		description: faker.company.name(),
		latitude: faker.location.latitude(),
		longitude: faker.location.longitude(),
		phone: faker.phone.number(),
		title: faker.company.name(),
	});

	let gymsRepository: GymRepository;
	let sut: SearchGymCase;

	beforeEach(() => {
		gymsRepository = new InMemoryGyRepository();
		sut = new SearchGymCase(gymsRepository);
	});

	it('should be able to fetch paginated gym history', async () => {
		const gymOne = createGymFakeData();
		await gymsRepository.create(gymOne);
		const gymTwo = createGymFakeData();
		await gymsRepository.create(gymTwo);
		const { gyms } = await sut.execute({ query: gymOne.title, page: 1 });
		expect(gyms).toHaveLength(1);
	});
	it('should be able to fetch paginated gym history', async () => {
		const title: string = 'Teste';

		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				...createGymFakeData(),
				title: `${title}-${i}`,
			});
		}
		const { gyms } = await sut.execute({ query: title, page: 1 });
		expect(gyms).toHaveLength(20);
	});
});
