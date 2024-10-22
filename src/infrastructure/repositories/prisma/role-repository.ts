import type { Role } from '@prisma/client';

import type {
	OptionalRole,
	RegisterParams,
	RoleRepository,
} from '@/domain/repositories/role';

import { prisma } from './config';
class PrismaRoleRepository implements RoleRepository {
	async findByName(roleName: string): Promise<OptionalRole> {
		return prisma.role.findUnique({
			where: {
				name: roleName,
			},
		});
	}
	findById(roleId: string): Promise<OptionalRole> {
		return prisma.role.findUnique({
			where: {
				id: roleId,
			},
		});
	}
	async register(params: RegisterParams): Promise<Role> {
		return prisma.role.create({
			data: {
				id: params.id,
				name: params.name,
			},
		});
	}
}
export { PrismaRoleRepository };
