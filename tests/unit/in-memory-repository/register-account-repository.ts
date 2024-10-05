import { randomUUID } from 'node:crypto';

import type { Account } from '@/domain/entities/account';
import type { AccountRole } from '@/domain/entities/account-role';
import type { RegisterAccountRepository } from '@/domain/repositories/register-account';
import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';

interface Model extends Omit<Account, 'role'> {
	roles: AccountRole[];
}
class InMemoryRegisterAccountRepository implements RegisterAccountRepository {
	private items: Model[] = [];
	private readonly roleHierarchy: AccountRole['name'][] = [
		'super',
		'admin',
		'user',
	];

	async register(account: RegisterAccountUseCase.Params): Promise<Account> {
		const { email, name, password, role } = account;
		const newAccount = {
			email,
			name,
			password,
			roles: [{ id: randomUUID(), name: role }],
			id: randomUUID(),
			avatarUrl: null,
		};
		this.items.push(newAccount);

		return this.mapAccountToResponse(newAccount);
	}
	async findByEmail(email: string): Promise<Account | null> {
		const account = this.items.find((item) => item.email === email);
		if (!account) return null;
		return this.mapAccountToResponse(account);
	}
	assignRole(assignRole: RegisterAccountRepository.AssignRole): Promise<void> {
		const { roleId, userId } = assignRole;
		const account = this.items.find((item) => item.id === userId);
		if (account) {
			account.roles.push({ id: roleId, name: roleId as AccountRole['name'] });
		}
		return Promise.resolve();
	}

	private getHighestRole(roles: AccountRole[]): AccountRole['name'] {
		if (roles.length === 0) {
			return 'user'; // Retorna 'user' se não houver papéis
		}

		// Encontra o papel mais alto baseado na hierarquia
		const roleNames = roles.map((role) => role.name);
		for (const role of this.roleHierarchy) {
			if (roleNames.includes(role)) {
				return role; // Retorna o primeiro papel mais alto encontrado
			}
		}

		return 'user'; // Se nenhum papel correspondente for encontrado, retorna 'user'
	}
	private mapAccountToResponse(account: Model): Account {
		return {
			id: account.id,
			name: account.name,
			email: account.email,
			avatarUrl: account.avatarUrl,
			role: this.getHighestRole(account.roles),
		};
	}
}

export { InMemoryRegisterAccountRepository };
