import { randomUUID } from 'node:crypto';

import type { RoleDto } from '@/domain/dto/role';
import type {
	OptionalRole,
	RegisterParams,
	RoleRepository,
} from '@/domain/repositories/role';

class InMemoryRoleRepository implements RoleRepository {
	private items: RoleDto[] = [];
	public clear() {
		this.items = [];
	}

	async findByName(name: string): Promise<OptionalRole> {
		return this.items.find((item) => item.name === name) ?? null;
	}
	async findById(id: string): Promise<OptionalRole> {
		return this.items.find((item) => item.id === id) ?? null;
	}
	async register(params: RegisterParams): Promise<RoleDto> {
		const role = {
			id: params.id ?? randomUUID(),
			name: params.name,
		};
		this.items.push(role);
		return role;
	}
}
export { InMemoryRoleRepository };
