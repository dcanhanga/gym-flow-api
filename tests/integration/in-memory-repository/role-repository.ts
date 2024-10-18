import { randomUUID } from 'node:crypto';

import type { Role } from '@/application/entities/role';
import type {
	NewRoleResponse,
	OptionalRoleResponse,
	RoleRepository,
} from '@/application/repositories/role-repository';

class InMemoryRoleRepository implements RoleRepository {
	private items: Role[] = [];
	public clear() {
		this.items = [];
	}

	async findByName(name: string): Promise<OptionalRoleResponse> {
		return this.items.find((item) => item.name === name) ?? null;
	}
	async findById(id: string): Promise<OptionalRoleResponse> {
		return this.items.find((item) => item.id === id) ?? null;
	}
	async register(name: string): Promise<NewRoleResponse> {
		const role = {
			id: randomUUID(),
			name,
		};
		this.items.push(role);
		return role;
	}
}
export { InMemoryRoleRepository };
