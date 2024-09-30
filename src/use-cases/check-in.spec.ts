import { randomUUID } from 'node:crypto';
import type { CheckInRepository } from '@/repositories/check-in-repository';
import type { GymRepository } from '@/repositories/gyms-repository';
import { InMemoryInCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { InMemoryGyRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { faker } from '@faker-js/faker';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in';
import { DistanceError } from './errors/distance-error';
import { DuplicateCheckInError } from './errors/duplicate-check-in-error';

describe('Check In UseCase', () => {
	type CheckInFakeData = {
		userId: string;
		validatedAt?: Date | null;
		userLatitude: number;
		userLongitude: number;
	};

	type GymFakeData = {
		latitude: number;
		longitude: number;
		phone: string;
		title: string;
	};

	const createCheckInFakeData = (): CheckInFakeData => ({
		userId: randomUUID(),
		validatedAt: new Date(),
		userLatitude: faker.location.latitude(),
		userLongitude: faker.location.longitude(),
	});

	const createGymFakeData = (): GymFakeData => ({
		latitude: faker.location.latitude(),
		longitude: faker.location.longitude(),
		phone: faker.phone.number(),
		title: faker.company.name(),
	});

	let checkInRepository: CheckInRepository;
	let gymsRepository: GymRepository;
	let sut: CheckInUseCase;

	beforeEach(() => {
		checkInRepository = new InMemoryInCheckInRepository();
		gymsRepository = new InMemoryGyRepository();
		sut = new CheckInUseCase(checkInRepository, gymsRepository);
		vi.useFakeTimers();
	});

	beforeAll(() => {
		vi.useRealTimers();
	});

	it('should return object with checkIn property', async () => {
		const gymData = createGymFakeData();
		const {
			id: gymId,
			latitude,
			longitude,
		} = await gymsRepository.create(gymData);
		const checkInData = createCheckInFakeData();

		const checkIn = await sut.execute({
			gymId,
			...checkInData,
			userLatitude: Number(latitude),
			userLongitude: Number(longitude),
		});

		expect(checkIn).toHaveProperty('checkIn');
	});

	it('should return a valid check-in with the correct types', async () => {
		const gymData = createGymFakeData();
		const {
			id: gymId,
			latitude,
			longitude,
		} = await gymsRepository.create(gymData);
		const checkInData = createCheckInFakeData();

		const { checkIn } = await sut.execute({
			gymId,
			...checkInData,
			userLatitude: Number(latitude),
			userLongitude: Number(longitude),
		});

		expect(checkIn).toHaveProperty('id', expect.any(String));
		expect(checkIn).toHaveProperty('gymId', expect.any(String));
		expect(checkIn).toHaveProperty('userId', expect.any(String));
		expect(checkIn).toHaveProperty('createdAt', expect.any(Date));
		expect(
			checkIn.validatedAt === null || checkIn.validatedAt instanceof Date,
		).toBe(true);
	});

	it('should return a valid check-in with validatedAt as null', async () => {
		const gymData = createGymFakeData();
		const {
			id: gymId,
			latitude,
			longitude,
		} = await gymsRepository.create(gymData);
		const checkInData = createCheckInFakeData();

		const { checkIn } = await sut.execute({
			gymId,
			...checkInData,
			userLatitude: Number(latitude),
			userLongitude: Number(longitude),
			validatedAt: null,
		});

		expect(checkIn.validatedAt).toBe(null);
	});

	it('should return a valid check-in with validatedAt as a date', async () => {
		const gymData = createGymFakeData();
		const {
			id: gymId,
			latitude,
			longitude,
		} = await gymsRepository.create(gymData);
		const checkInData = createCheckInFakeData();

		const { checkIn } = await sut.execute({
			gymId,
			...checkInData,
			userLatitude: Number(latitude),
			userLongitude: Number(longitude),
			validatedAt: new Date(),
		});

		expect(checkIn.validatedAt).toBeInstanceOf(Date);
	});

	it('should not allow multiple check-ins on the same day', async () => {
		vi.setSystemTime(new Date(Date.UTC(2012, 11, 20, 12, 0, 0)));
		const gymData = createGymFakeData();
		const {
			id: gymId,
			latitude,
			longitude,
		} = await gymsRepository.create(gymData);
		const { userId } = createCheckInFakeData();

		await sut.execute({
			gymId,
			userId,
			userLatitude: Number(latitude),
			userLongitude: Number(longitude),
		});

		await expect(() =>
			sut.execute({
				gymId,
				userId,
				userLatitude: Number(latitude),
				userLongitude: Number(longitude),
			}),
		).rejects.toBeInstanceOf(DuplicateCheckInError);
	});

	it('should allow check-in on a different day', async () => {
		vi.setSystemTime(new Date(Date.UTC(2012, 11, 20, 12, 0, 0)));
		const gymData = createGymFakeData();
		const {
			id: gymId,
			latitude,
			longitude,
		} = await gymsRepository.create(gymData);
		const { userId } = createCheckInFakeData();

		await sut.execute({
			gymId,
			userId,
			userLatitude: Number(latitude),
			userLongitude: Number(longitude),
		});

		vi.setSystemTime(new Date(Date.UTC(2012, 11, 21, 12, 0, 0)));

		const checkIn = await sut.execute({
			gymId,
			userId,
			userLatitude: Number(latitude),
			userLongitude: Number(longitude),
		});

		expect(checkIn).toHaveProperty('checkIn');
	});

	it('should not allow check-in if too far from gym', async () => {
		const gymData = createGymFakeData();
		const { id: gymId } = await gymsRepository.create(gymData);
		const { userId, userLatitude, userLongitude } = createCheckInFakeData();

		await expect(() =>
			sut.execute({
				gymId,
				userId,
				userLatitude,
				userLongitude,
			}),
		).rejects.toBeInstanceOf(DistanceError);
	});
});
