import { randomUUID } from 'node:crypto';

import type { GymRepository } from '@/repositories/gyms-repository';

import { InMemoryGyRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CreateGymUseCase } from './create-gym';

describe('Gym use case', () => {
	type GymFakeData = {
		description: string | null;
		latitude: number;
		longitude: number;
		phone: string;
		title: string;
	};

	const createGymFakeData = (): GymFakeData => ({
		description: faker.company.name(),
		latitude: faker.location.latitude(),
		longitude: faker.location.longitude(),
		phone: faker.phone.number(),
		title: faker.company.name(),
	});

	let gymsRepository: GymRepository;
	let sut: CreateGymUseCase;

	beforeEach(() => {
		gymsRepository = new InMemoryGyRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it('should create a gym and return gym objet', async () => {
		const { latitude, longitude, phone, title, description } =
			createGymFakeData();
		const gym = await sut.execute({
			description,
			latitude,
			longitude,
			phone,
			title,
		});

		expect(gym).toHaveProperty('gym');
	});
	it('should correctly map the gym properties from input data', async () => {
		const { latitude, longitude, phone, title, description } =
			createGymFakeData();
		const gym = await sut.execute({
			description,
			latitude,
			longitude,
			phone,
			title,
		});

		expect(gym).toHaveProperty('gym');
	});
	it('should return object with gym property', async () => {
		const { latitude, longitude, phone, title, description } =
			createGymFakeData();
		const { gym } = await sut.execute({
			description,
			latitude,
			longitude,
			phone,
			title,
		});

		expect(gym.description).toStrictEqual(description);
		expect(gym.phone).toStrictEqual(phone);
		expect(gym.title).toStrictEqual(title);
		expect(Number(gym.latitude)).toStrictEqual(latitude);
		expect(Number(gym.longitude)).toStrictEqual(longitude);
	});
});
