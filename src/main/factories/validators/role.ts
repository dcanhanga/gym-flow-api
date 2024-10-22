import { ZodRoleValidator } from '@/infrastructure/validators/zod/role';

function roleValidatorFactory() {
	return new ZodRoleValidator();
}

export const validator = {
	role: roleValidatorFactory(),
};
