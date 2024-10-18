import { ForbiddenError } from '@/application/errors/forbidden';
import { UnauthorizedError } from '@/application/errors/unauthorized';
import type {
	LoadAccountByToken,
	LoadAccountByTokenParams,
} from '@/application/use-cases/interfaces/load-account-by-token';

import { HttpResponse } from '../helpers/http-response';
import type { ApiResponse } from '../helpers/interface/api-response';
import type { Middleware } from './interfaces/middleware';

class AuthMiddleware
	implements Middleware<AuthMiddleware.Request, AuthMiddleware.Response>
{
	constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
	async handle(
		request: AuthMiddleware.Request,
	): Promise<ApiResponse<AuthMiddleware.Response>> {
		try {
			const account = await this.loadAccountByToken.load(request);

			return HttpResponse.ok('', { accountId: account.id });
		} catch (error) {
			return this.handleError(error);
		}
	}
	private handleError(error: unknown): ApiResponse<AuthMiddleware.Response> {
		if (error instanceof ForbiddenError) {
			return HttpResponse.forbidden(error.message);
		}
		if (error instanceof UnauthorizedError) {
			return HttpResponse.unauthorized(error.message);
		}

		return HttpResponse.serverError();
	}
}
namespace AuthMiddleware {
	export type Request = LoadAccountByTokenParams;
	export type Response = null | { accountId: string };
}

export { AuthMiddleware };
