import { randomUUID } from 'node:crypto';
import type { CheckInRepository } from '@/repositories/check-in-repository';
import { InMemoryInCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { beforeEach, describe, expect, it } from 'vitest';

import { GetUserMetricsUseCase } from './get-user-metrics';

describe('Get user Metrics', () => {
	type CheckInFakeData = {
		userId: string;
		gymId: string;
	};

	const createCheckInFakeData = (): CheckInFakeData => ({
		userId: 'user-1',
		gymId: randomUUID(),
	});

	let checkInRepository: CheckInRepository;

	let sut: GetUserMetricsUseCase;

	beforeEach(() => {
		checkInRepository = new InMemoryInCheckInRepository();
		sut = new GetUserMetricsUseCase(checkInRepository);
	});

	it('should be able to get check-ins count from metrics', async () => {
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
		const { checkInsCount } = await sut.execute({
			userId: checkInOne.userId,
		});
		expect(checkInsCount).toStrictEqual(2);
	});
});
