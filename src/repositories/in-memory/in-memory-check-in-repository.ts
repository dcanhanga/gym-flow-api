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
}
