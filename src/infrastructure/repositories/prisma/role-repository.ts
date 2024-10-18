import type {
	NewRoleResponse,
	OptionalRoleResponse,
	RoleRepository,
} from '@/application/repositories/role-repository';

import { prisma } from '.';
class PrismaRoleRepository implements RoleRepository {
	async findByName(roleName: string): Promise<OptionalRoleResponse> {
		return prisma.role.findUnique({
			where: {
				name: roleName,
			},
		});
	}
	findById(roleId: string): Promise<OptionalRoleResponse> {
		return prisma.role.findUnique({
			where: {
				id: roleId,
			},
		});
	}
	async register(roleName: string): Promise<NewRoleResponse> {
		return prisma.role.create({
			data: {
				name: roleName,
			},
		});
	}
}
export { PrismaRoleRepository };
