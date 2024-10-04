import { randomUUID } from 'node:crypto';
import type { CheckIn, Prisma, User } from '@prisma/client';
import dayjs from 'dayjs';
import type { CheckInRepository } from '../check-in-repository';

export class InMemoryInCheckInRepository implements CheckInRepository {
	private items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn: CheckIn = {
			id: randomUUID(),
			userId: data.userId,
			gymId: data.gymId,
			createdAt: new Date(),
			validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
		};
		this.items.push(checkIn);
		return checkIn;
	}
	async findUserByIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date');
		const endOfTheDay = dayjs(date).endOf('date');

		const checkIn = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.createdAt);
			const checkInOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
			return checkIn.userId === userId && checkInOnSameDate;
		});
		if (!checkIn) return null;
		return checkIn;
	}
	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		return this.items
			.filter((item) => item.userId === userId)
			.slice((page - 1) * 20, page * 20);
	}
	async countByUserId(userId: string): Promise<number> {
		return this.items.filter((item) => item.userId === userId).length;
	}
	async findById(checkInId: string): Promise<CheckIn | null> {
		const checkIn = this.items.find((item) => item.id === checkInId);
		if (!checkIn) {
			return null;
		}
		return checkIn;
	}
	async save(checkIn: CheckIn): Promise<CheckIn> {
		const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);
		if (checkInIndex >= 1) {
			this.items[checkInIndex] = checkIn;
		}
		return checkIn;
	}
}
