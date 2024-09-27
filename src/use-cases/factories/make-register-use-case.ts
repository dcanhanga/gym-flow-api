import { PrismaUserRepository } from '@/repositories/prisma/prisma-users.repository';
import { RegisterUseCase } from '../register';

function makeRegisterUseCase(): RegisterUseCase {
	return new RegisterUseCase(new PrismaUserRepository());
}

export const registerUseCase = makeRegisterUseCase();
