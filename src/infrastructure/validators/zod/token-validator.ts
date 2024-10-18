import { z } from 'zod';

import { messages } from '@/application/errors/message';

import type {
	LoadAccountByTokenValidator,
	Params,
} from '@/application/validators/interfaces/load-account-by-token-validator';
import { ErrorFormatter, JWTTokenValidator } from './utils';

class ZodLoadAccountByTokenValidator implements LoadAccountByTokenValidator {
	private loadAccountByTokenSchema: z.ZodSchema;
	private errorFormatter: ErrorFormatter;

	constructor() {
		this.loadAccountByTokenSchema = z
			.object({
				token: new JWTTokenValidator().validate(),
			})
			.strict({ message: messages.UNRECOGNIZED_FIELD });
		this.errorFormatter = new ErrorFormatter();
	}

	validate(params: Params) {
		const result = this.safeParse(params);
		if (!result.success) {
			return this.errorFormatter.format(result.error.issues);
		}
		return null;
	}

	private safeParse(params: Params) {
		return this.loadAccountByTokenSchema.safeParse(params);
	}
}

export { ZodLoadAccountByTokenValidator };
