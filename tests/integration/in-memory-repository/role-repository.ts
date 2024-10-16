import { randomUUID } from 'node:crypto';

import type { Role } from '@/application/entities/role';
import type {
	FindByIdResponse,
	FindByNameResponse,
	RegisterResponse,
	RoleName,
	RoleRepository,
} from '@/application/repositories/role-repository';

class InMemoryRoleRepository implements RoleRepository {
	private items: Role[] = [];
	public clear() {
		this.items = [];
	}

	async findByName(name: RoleName): Promise<FindByNameResponse> {
		return this.items.find((item) => item.name === name) ?? null;
	}
	async findById(id: string): Promise<FindByIdResponse> {
		return this.items.find((item) => item.id === id) ?? null;
	}
	async register(name: RoleName): Promise<RegisterResponse> {
		const role = {
			id: randomUUID(),
			name,
		};
		this.items.push(role);
		return role;
	}
}
export { InMemoryRoleRepository };
