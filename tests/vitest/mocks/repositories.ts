import { vi } from 'vitest';

import type { AccountRepository, RoleRepository } from '@/domain/repositories';

export const mockAccountRepository = vi.mocked<AccountRepository>({
	findById: vi.fn(),
	findByEmail: vi.fn(),
	findWithRole: vi.fn(),
	register: vi.fn(),
});
export const mockRoleRepository = vi.mocked<RoleRepository>({
	findById: vi.fn(),
	findByName: vi.fn(),
	register: vi.fn(),
});
