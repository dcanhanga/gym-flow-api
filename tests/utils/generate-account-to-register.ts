import type { AccountRole } from '@/domain/entities/account-role';
import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';

import { faker } from '@faker-js/faker';

function generateAccountToRegister(
	role: AccountRole['name'],
): RegisterAccountUseCase.Params {
	const account: RegisterAccountUseCase.Params = {
		email: faker.internet.email(),
		name: faker.internet.userName(),
		password: faker.internet.password(),
		role: role,
	};
	return account;
}
export { generateAccountToRegister };
