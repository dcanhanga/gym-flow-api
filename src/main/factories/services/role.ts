import { RegisterRoleService } from '@/application/services/register-role';

import { repository } from '../repositories';
import { validator } from '../validators/role';

function registerRoleFactory() {
	return new RegisterRoleService(repository.role, validator.register);
}

export const role = {
	register: registerRoleFactory(),
};
