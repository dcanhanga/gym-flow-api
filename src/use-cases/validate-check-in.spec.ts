import { randomUUID } from 'node:crypto';
import type { CheckInRepository } from '@/repositories/check-in-repository';

import { InMemoryInCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExpiredCheckInError } from './errors/expired-check-in-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateCheckInUseCase } from './validate-check-in';

describe('Check In UseCase', () => {
	let checkInRepository: CheckInRepository;

	let sut: ValidateCheckInUseCase;

	beforeEach(() => {
		checkInRepository = new InMemoryInCheckInRepository();

		sut = new ValidateCheckInUseCase(checkInRepository);
		vi.useFakeTimers();
	});

	beforeAll(() => {
		vi.useRealTimers();
	});
	it('should be abale to validate check-in', async () => {
		const { id } = await checkInRepository.create({
			gymId: 'gym-1',
			userId: 'user-1',
		});
		const { checkIn } = await sut.execute({ checkInId: id });
		expect(checkIn.validatedAt).toEqual(expect.any(Date));
	});
	it('should not be to validate inexistent check-in', async () => {
		await expect(
			sut.execute({
				checkInId: randomUUID(),
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
	it('should not be to validate inexistent the check-in after 20 minutes of this creation', async () => {
		vi.setSystemTime(new Date(2024, 9, 5, 9, 0));
		const { id } = await checkInRepository.create({
			gymId: 'gym-1',
			userId: 'user-1',
		});
		const twentyOneMinutesInSec = 1000 * 60 * 21;
		vi.advanceTimersByTime(twentyOneMinutesInSec);
		expect(
			async () => await sut.execute({ checkInId: id }),
		).rejects.toBeInstanceOf(ExpiredCheckInError);
	});
});
