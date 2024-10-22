import type {
	Params,
	RegisterRole,
} from '@/application/use-cases/role/protocols/register';
import {
	InvalidParametersError,
	ResourceConflictError,
} from '@/domain/errors/';
import { HttpResponse } from '../helpers/http-response';
import type { ApiResponse } from '../helpers/interface/api-response';
import { messages } from '../helpers/messages';
import type { Controller } from './interfaces/controller';

class RegisterRoleController
	implements
		Controller<RegisterRoleController.Request, RegisterRoleController.Response>
{
	constructor(private readonly registerRoleUseCase: RegisterRole) {}
	async handle(
		request: RegisterRoleController.Request,
	): Promise<ApiResponse<RegisterRoleController.Response>> {
		try {
			await this.registerRoleUseCase.register(request);

			return HttpResponse.created(messages.ROLE_CREATED_SUCCESS, null);
		} catch (error) {
			return this.handleError(error);
		}
	}
	private handleError(
		error: unknown,
	): ApiResponse<RegisterRoleController.Response> {
		if (error instanceof InvalidParametersError) {
			return HttpResponse.badRequest(error.message, error.errors);
		}
		if (error instanceof ResourceConflictError) {
			return HttpResponse.conflict(error.message);
		}

		return HttpResponse.serverError();
	}
}
namespace RegisterRoleController {
	export type Request = Params;
	export type Response = null;
}

export { RegisterRoleController };
