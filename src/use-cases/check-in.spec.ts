import { randomUUID } from 'node:crypto';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CheckInRepository } from '@/repositories/check-in-repository';
import { InMemoryInCheckInRepository } from '@/repositories/in-memory/prisma-check-in-repository';
import { CheckInUseCase } from './check-in';

describe('Check in UseCase', () => {
	type CheckInFakeData = {
		gymId: string;
		userId: string;
		validatedAt?: Date | null;
	};
	const CheckInInputData = (): CheckInFakeData => ({
		gymId: randomUUID(),
		userId: randomUUID(),
		validatedAt: new Date(),
	});
	let checkInRepository: CheckInRepository;
	let sut: CheckInUseCase;

	beforeEach(() => {
		checkInRepository = new InMemoryInCheckInRepository();
		sut = new CheckInUseCase(checkInRepository);
		vi.useFakeTimers();
	});
	beforeAll(() => {
		vi.useRealTimers();
	});

	it('should return a valid check-in with the correct types', async () => {
		const { gymId, userId } = CheckInInputData();
		const checkIn = await sut.execute({ gymId, userId });
		expect(checkIn).toHaveProperty('checkIn');
		expect(checkIn.checkIn).toHaveProperty('id', expect.any(String));
		expect(checkIn.checkIn).toHaveProperty('gymId', expect.any(String));
		expect(checkIn.checkIn).toHaveProperty('userId', expect.any(String));
		expect(checkIn.checkIn).toHaveProperty('createdAt', expect.any(Date));
		expect(checkIn.checkIn).toHaveProperty('validatedAt');
		expect(
			checkIn.checkIn.validatedAt === null ||
				checkIn.checkIn.validatedAt instanceof Date,
		).toBe(true);
	});
	it('should return a valid check-in with the correct types validateAt a date', async () => {
		const { gymId, userId, validatedAt } = CheckInInputData();
		const checkIn = await sut.execute({ gymId, userId, validatedAt });
		expect(checkIn).toHaveProperty('checkIn');
		expect(checkIn.checkIn).toHaveProperty('id', expect.any(String));
		expect(checkIn.checkIn).toHaveProperty('gymId', expect.any(String));
		expect(checkIn.checkIn).toHaveProperty('userId', expect.any(String));
		expect(checkIn.checkIn).toHaveProperty('createdAt', expect.any(Date));
		expect(checkIn.checkIn).toHaveProperty('validatedAt', expect.any(Date));
	});
	it('should not be to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(Date.UTC(2012, 11, 20, 12, 0, 0)));
		const { gymId, userId } = CheckInInputData();

		await sut.execute({ gymId, userId });
		expect(() => sut.execute({ gymId, userId })).rejects.toBeInstanceOf(Error);
	});
	it('should be able to check twice with diferente date', async () => {
		const { gymId, userId } = CheckInInputData();
		vi.setSystemTime(new Date(Date.UTC(2012, 11, 20, 12, 0, 0)));
		await sut.execute({ gymId, userId });
		vi.setSystemTime(new Date(Date.UTC(2012, 11, 21, 12, 0, 0)));
		const checkIn = await sut.execute({ gymId, userId });
		expect(checkIn).toHaveProperty('checkIn');
	});
});
