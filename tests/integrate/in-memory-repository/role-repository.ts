import { randomUUID } from 'node:crypto';
import type { AccountRole } from '@/domain/entities/account-role';
import type { RoleRepository } from '@/domain/repositories/role-repository';

class InMemoryRoleRepository implements RoleRepository {
	private items: AccountRole[] = [];
	public clear(): void {
		this.items = [];
	}

	async findByName(
		roleName: RoleRepository.RoleName,
	): Promise<RoleRepository.FindByNameResponse> {
		const role = this.items.find((role) => role.name === roleName);
		if (!role) {
			return null;
		}
		return role;
	}

	async findById(roleId: string): Promise<RoleRepository.FindByIdResponse> {
		const role = this.items.find((role) => role.id === roleId);
		if (!role) {
			return null;
		}
		return role;
	}

	async addRole(
		name: AccountRole['name'],
	): Promise<RoleRepository.AddRoleResponse> {
		const newRole: AccountRole = { id: randomUUID(), name };
		this.items.push(newRole);
		return newRole;
	}
}

export { InMemoryRoleRepository };
