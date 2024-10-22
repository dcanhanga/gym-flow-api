import { RegisterRoleUseCase } from '@/application/use-cases/role/register-role';
import { repository } from '../repositories';
import { validator } from '../validators/role';

function registerRoleFactory() {
	return new RegisterRoleUseCase(repository.role, validator.role);
}

export const role = {
	register: registerRoleFactory(),
};
