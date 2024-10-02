import type { CheckIn, Prisma } from '@prisma/client';

export interface CheckInRepository {
	create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>;
	findUserByIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>;
	countByUserId: (userId: string) => Promise<number>;
	findManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>;
}
