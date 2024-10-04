import { randomUUID } from 'node:crypto';
import type { CheckInRepository } from '@/repositories/check-in-repository';

import { InMemoryInCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateCheckInUseCase } from './validate-check-in';

describe('Check In UseCase', () => {
	let checkInRepository: CheckInRepository;

	let sut: ValidateCheckInUseCase;

	beforeEach(() => {
		checkInRepository = new InMemoryInCheckInRepository();

		sut = new ValidateCheckInUseCase(checkInRepository);
		// vi.useFakeTimers();
	});

	beforeAll(() => {
		// vi.useRealTimers();
	});
	it('should be abale to validate check-in', async () => {
		const { id } = await checkInRepository.create({
			gymId: 'gym-1',
			userId: 'user-1',
		});
		const { checkIn } = await sut.execute({ CheckInId: id });
		expect(checkIn.validatedAt).toEqual(expect.any(Date));
	});
	it('should not be to validate inexistent check-in', async () => {
		await expect(
			sut.execute({
				CheckInId: randomUUID(),
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
