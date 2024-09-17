import { env } from '@/env/config.js';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
	log: env.NODE_ENV === 'development' ? ['query'] : [],
});
