import type { RegisterAccountParams } from '@/application/use-cases/interfaces/register-account';
import type { AccountRole } from '@/domain/entities/account-role';

import { faker } from '@faker-js/faker';

function generateAccountToRegister(
	role: AccountRole['name'],
): RegisterAccountParams {
	const account: RegisterAccountParams = {
		email: faker.internet.email(),
		name: faker.person.fullName(),
		password: 'seCure-AK6S',
		role: role,
	};

	return account;
}
export { generateAccountToRegister };
