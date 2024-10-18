import { RegisterRoleUseCase } from '@/application/use-cases/register-role';

import { repository } from '../repositories';
import { validator } from '../validators/role';

function registerRoleUseCaseFactory() {
	return new RegisterRoleUseCase(repository.role, validator.register);
}

export const useCase = {
	register: registerRoleUseCaseFactory(),
};
