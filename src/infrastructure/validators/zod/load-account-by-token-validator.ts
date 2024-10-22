import { z } from 'zod';

import { messages } from '@/domain/errors/message';

import type {
	LoadAccountByTokenParams,
	LoadAccountByTokenValidator,
} from '@/application/use-cases/account/protocols/load-by-token';
import { AuthenticationRequiredError } from '@/domain/errors';
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

	validate(params: LoadAccountByTokenParams) {
		const result = this.safeParse(params);
		if (!result.success) {
			throw new AuthenticationRequiredError(messages.ACESSES_DENIED);
		}
		return result.data;
	}

	private safeParse(params: LoadAccountByTokenParams) {
		return this.loadAccountByTokenSchema.safeParse(params);
	}
}

export { ZodLoadAccountByTokenValidator };
