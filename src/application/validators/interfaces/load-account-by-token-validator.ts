import type { LoadAccountByTokenParams } from '@/application/use-cases/interfaces/load-account-by-token';

import type { ErrorResponse } from './error-response';

interface LoadAccountByTokenValidator {
	validate(params: Params): ErrorResponse;
}
type Params = LoadAccountByTokenParams;
export type { LoadAccountByTokenValidator, Params };
