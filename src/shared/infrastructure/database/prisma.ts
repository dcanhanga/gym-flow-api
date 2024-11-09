import { env } from '@/main/config/env/config.js';
import { PrismaClient, type Region } from '@prisma/client';

export const prisma = new PrismaClient({
	log: env.NODE_ENV === 'dev' ? ['query'] : [],
});
