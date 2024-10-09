import { randomUUID } from 'node:crypto';
import type { AccountRole } from '@/domain/entities/account-role';
import type { RoleRepository } from '@/domain/repositories/role-repository';

class StubRoleRepository implements RoleRepository {
	async findByName(
		_roleName: RoleRepository.RoleName,
	): Promise<RoleRepository.FindByNameResponse> {
		return { id: randomUUID(), name: 'user' };
	}

	async findById(_roleId: string): Promise<RoleRepository.FindByIdResponse> {
		return { id: randomUUID(), name: 'user' };
	}

	async addRole(
		_name: AccountRole['name'],
	): Promise<RoleRepository.AddRoleResponse> {
		return { id: randomUUID(), name: 'user' };
	}
}

export { StubRoleRepository };
