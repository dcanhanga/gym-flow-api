import { randomUUID } from 'node:crypto';

import type {
	NewRoleResponse,
	OptionalRoleResponse,
	RoleRepository,
} from '@/application/repositories/role-repository';

class StubRoleRepository implements RoleRepository {
	async findByName(_roleName: string): Promise<OptionalRoleResponse> {
		return null;
	}

	async findById(_roleId: string): Promise<OptionalRoleResponse> {
		return null;
	}

	async register(_roleName: string): Promise<NewRoleResponse> {
		return { id: randomUUID(), name: 'USER' };
	}
}

export { StubRoleRepository };
