import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository';
import { AuthenticatedUseCase } from '../authenticate';

function makeAuthenticateUseCase(): AuthenticatedUseCase {
	return new AuthenticatedUseCase(new PrismaUserRepository());
}

export const authenticateUseCase = makeAuthenticateUseCase();
