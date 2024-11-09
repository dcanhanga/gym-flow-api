import { PrismaRoleRepository } from '@/infrastructure/repositories/prisma/role-repository';

function roleRepositoryFactory() {
	return new PrismaRoleRepository();
}
export { roleRepositoryFactory };
