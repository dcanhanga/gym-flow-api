import { RegisterRoleController } from '@/presentation/controllers/register-role';
import { role } from '../services/role';

function registerRoleFactory() {
	return new RegisterRoleController(role.register);
}

export const controller = {
	register: registerRoleFactory(),
};
