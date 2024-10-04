import { beforeEach, describe, expect, it } from 'vitest';

import type { GymRepository } from '@/repositories/gyms-repository';
import { InMemoryGyRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

describe('Fetch nearby gym use case', () => {
	let gymRepository: GymRepository;

	let sut: FetchNearbyGymsUseCase;

	beforeEach(() => {
		gymRepository = new InMemoryGyRepository();
		sut = new FetchNearbyGymsUseCase(gymRepository);
	});
	it('It should be able to fetch nearby gyms', async () => {
		await gymRepository.create({
			title: 'Far gym',
			latitude: -8.846656346867636,
			longitude: 13.238517868234268,
			phone: '924583463',
		});

		await gymRepository.create({
			title: 'Near gym',
			latitude: -8.923392442104717,
			longitude: 13.1818188187867,
			phone: '924583463',
		});

		const { gyms } = await sut.execute({
			userLatitude: -8.9200516,
			userLongitude: 13.1625117,
		});
		expect(gyms).toHaveLength(1);

		expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })]);
	});
});
