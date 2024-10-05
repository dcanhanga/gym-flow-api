import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';

import type { Role } from '@/domain/entities/role';
import type { RoleRepository } from '@/domain/repositories/role';

class RoleRepositoryStub implements RoleRepository {
	async findByName(_name: string): Promise<Role> {
		throw new Error('Method not implemented.');
	}
}
export { RoleRepositoryStub };
