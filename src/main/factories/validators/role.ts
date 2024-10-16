import { ZodRegisterRoleValidator } from '@/infrastructure/validators/zod/register-role-validator';

function registerRoleValidatorFactory() {
	return new ZodRegisterRoleValidator();
}

export const validator = {
	register: registerRoleValidatorFactory(),
};
