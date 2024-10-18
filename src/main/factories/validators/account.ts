import { ZodLoadAccountByTokenValidator } from '@/infrastructure/validators/zod/token-validator';

function loadAccountByTokenValidator() {
	return new ZodLoadAccountByTokenValidator();
}

export const validator = {
	loadAccountByTokenValidator,
};
