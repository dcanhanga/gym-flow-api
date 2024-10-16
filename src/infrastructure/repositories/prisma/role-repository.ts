import type {
	FindByNameResponse,
	RegisterResponse,
	RoleName,
	RoleRepository,
} from '@/application/repositories/role-repository';

import { prisma } from '.';
class PrismaRoleRepository implements RoleRepository {
	async findByName(roleName: RoleName): Promise<FindByNameResponse> {
		return prisma.role.findUnique({
			where: {
				name: roleName,
			},
		});
	}
	findById(roleId: string): Promise<FindByNameResponse> {
		return prisma.role.findUnique({
			where: {
				id: roleId,
			},
		});
	}
	async register(roleName: RoleName): Promise<RegisterResponse> {
		return prisma.role.create({
			data: {
				name: roleName,
			},
		});
	}
}
export { PrismaRoleRepository };
