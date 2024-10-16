import { RegisterRoleUseCase } from '@/application/use-cases/register-role';
import { roleRepositoryFactory } from '../repositories/role';
import { validator } from '../validators/role';

function registerRoleUseCaseFactory() {
	return new RegisterRoleUseCase(roleRepositoryFactory(), validator.register);
}

export const useCase = {
	register: registerRoleUseCaseFactory(),
};
