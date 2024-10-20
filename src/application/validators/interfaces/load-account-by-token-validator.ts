import type { LoadAccountByTokenParams } from '@/domain/use-cases/load-account-by-token';

import type { ErrorResponse } from './error-response';

interface LoadAccountByTokenValidator {
	validate(params: Params): ErrorResponse;
}
type Params = LoadAccountByTokenParams;
export type { LoadAccountByTokenValidator, Params };
