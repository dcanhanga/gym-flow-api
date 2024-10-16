import { RegisterRoleController } from '@/presentation/controllers/register-role';
import { useCase } from '../use-cases/role';

function registerRoleControllerFactory() {
	return new RegisterRoleController(useCase.register);
}

export const controller = {
	register: registerRoleControllerFactory(),
};
