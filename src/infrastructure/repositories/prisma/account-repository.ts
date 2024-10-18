import type {
	AccountInput,
	AccountRepository,
	NewAccountResponse,
	OptionalAccountResponse,
} from '@/application/repositories/account-repository';
import { prisma } from '.';
class PrismaAccountRepository implements AccountRepository {
	async findById(accountId: string): Promise<OptionalAccountResponse> {
		const account = await prisma.account.findUnique({
			where: {
				id: accountId,
			},
		});
		if (!account) {
			return null;
		}
		return {
			id: account.id,
			email: account.email,
			name: account.name,
			roleId: account.roleId,
			password: account.passwordHash,
			avatarUrl: account.avatarUrl,
		};
	}
	async register(params: AccountInput): Promise<NewAccountResponse> {
		const { name, email, password, roleId } = params;
		const account = await prisma.account.create({
			data: {
				email,
				name,
				passwordHash: password,
				roleId,
			},
		});
		return {
			id: account.id,
			email: account.email,
			name: account.name,
			roleId: account.roleId,
			password: account.passwordHash,
			avatarUrl: account.avatarUrl,
		};
	}
}
export { PrismaAccountRepository };
