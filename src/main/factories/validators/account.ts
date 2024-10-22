import { ZodLoadAccountByTokenValidator } from '@/infrastructure/validators/zod/load-account-by-token-validator';

function loadAccountByTokenValidator() {
	return new ZodLoadAccountByTokenValidator();
}

export const validator = {
	loadAccountByTokenValidator,
};
