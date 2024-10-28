import {
	AccessForbiddenError,
	InvalidParametersError,
	ResourceConflictError,
} from '@/application/errors';
import type { RegisterRole } from '@/application/use-cases/protocols/register-role';
import type { RoleRegistrationDto } from '@/domain/dto';
import { HttpResponse } from '../helpers/http-response';
import type { ApiResponse } from '../helpers/interface/api-response';
import { messages } from '../helpers/messages';
import type { Controller } from './interfaces/controller';

class RegisterRoleController implements Controller<Request, Response> {
	constructor(private readonly registerRoleUseCase: RegisterRole) {}
	async handle(request: Request): Promise<ApiResponse<Response>> {
		try {
			await this.registerRoleUseCase.register(request);

			return HttpResponse.created(messages.ROLE_CREATED_SUCCESS, null);
		} catch (error) {
			return this.handleError(error);
		}
	}
	private handleError(error: unknown): ApiResponse<Response> {
		if (error instanceof InvalidParametersError) {
			return HttpResponse.badRequest(error.message, error.errors);
		}
		if (error instanceof ResourceConflictError) {
			return HttpResponse.conflict(error.message);
		}
		if (error instanceof AccessForbiddenError) {
			return HttpResponse.forbidden(error.message);
		}

		return HttpResponse.serverError();
	}
}

export type Request = RoleRegistrationDto;
export type Response = null;

export { RegisterRoleController };
