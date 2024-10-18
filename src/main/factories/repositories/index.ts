import { PrismaAccountRepository } from '@/infrastructure/repositories/prisma/account-repository';
import { PrismaRoleRepository } from '@/infrastructure/repositories/prisma/role-repository';

export const repository = {
	role: new PrismaRoleRepository(),
	account: new PrismaAccountRepository(),
};
