import { randomUUID } from 'node:crypto';
import type { CheckInRepository } from '@/repositories/check-in-repository';
import { InMemoryInCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { beforeEach, describe, expect, it } from 'vitest';

import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history';

describe('Fetch user check-ins history', () => {
	type CheckInFakeData = {
		userId: string;
		gymId: string;
	};

	const createCheckInFakeData = (): CheckInFakeData => ({
		userId: 'user-1',
		gymId: randomUUID(),
	});

	let checkInRepository: CheckInRepository;

	let sut: FetchUserCheckInsUseCase;

	beforeEach(() => {
		checkInRepository = new InMemoryInCheckInRepository();
		sut = new FetchUserCheckInsUseCase(checkInRepository);
	});

	it('should be able to fetch paginated check-in history', async () => {
		const checkInOne = createCheckInFakeData();
		await checkInRepository.create({
			gymId: checkInOne.gymId,
			userId: checkInOne.userId,
		});
		const checkInTwo = createCheckInFakeData();
		await checkInRepository.create({
			gymId: checkInTwo.gymId,
			userId: checkInTwo.userId,
		});
		const { checkIns } = await sut.execute({
			userId: checkInOne.userId,
			page: 1,
		});
		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gymId: checkInOne.gymId }),
			expect.objectContaining({ gymId: checkInTwo.gymId }),
		]);
	});
	it('should be able to fetch paginated check-in history', async () => {
		const userId = randomUUID();
		for (let i = 1; i <= 22; i++) {
			const { gymId } = createCheckInFakeData();
			await checkInRepository.create({
				gymId: gymId,
				userId,
			});
		}
		const { checkIns } = await sut.execute({ userId: userId, page: 2 });
		expect(checkIns).toHaveLength(2);
	});
});
