import { randomUUID } from 'node:crypto';

import type {
	FindByIdResponse,
	FindByNameResponse,
	RegisterResponse,
	RoleName,
	RoleRepository,
} from '@/application/repositories/role-repository';

class StubRoleRepository implements RoleRepository {
	async findByName(_roleName: RoleName): Promise<FindByNameResponse> {
		return null;
	}

	async findById(_roleId: string): Promise<FindByIdResponse> {
		return null;
	}

	async register(_roleName: RoleName): Promise<RegisterResponse> {
		return { id: randomUUID(), name: 'USER' };
	}
}

export { StubRoleRepository };
