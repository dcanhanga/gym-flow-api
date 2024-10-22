import { RegisterRoleController } from '@/presentation/controllers/register-role';
import { role } from '../use-cases/role';

function registerRoleFactory() {
	return new RegisterRoleController(role.register);
}

export const controller = {
	register: registerRoleFactory(),
};
