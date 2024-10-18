import type { ErrorResponse } from '@/application/validators/interfaces/error-response';

import type {
	LoadAccountByTokenValidator,
	Params,
} from '@/application/validators/interfaces/load-account-by-token-validator';

class StubTokenValidator implements LoadAccountByTokenValidator {
	validate(_params: Params): ErrorResponse {
		return null;
	}
}
export { StubTokenValidator };
