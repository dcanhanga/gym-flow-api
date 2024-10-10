import { InvalidParams } from '@/application/errors/invalid-params';
import { ResourceAlreadyExists } from '@/application/errors/resource-already-exists';
import { ResourceNotFound } from '@/application/errors/resource-not-found';
import type {
	RegisterAccount,
	RegisterAccountParams,
} from '@/application/use-cases/interfaces/register-account';
import { HttpResponse } from '../helpers/http-response';
import type { ApiResponse } from '../helpers/interface/api-response';
import type { Controller } from './interfaces/controller';

class RegisterAccountController
	implements
		Controller<
			RegisterAccountController.Request,
			RegisterAccountController.Response
		>
{
	constructor(private readonly registerAccountService: RegisterAccount) {}
	async handle(
		request: RegisterAccountController.Request,
	): Promise<ApiResponse<RegisterAccountController.Response>> {
		try {
			await this.registerAccountService.register(request);

			return HttpResponse.created(null);
		} catch (error) {
			console.log(error);
			if (error instanceof InvalidParams) {
				return HttpResponse.badRequest(error.errors);
			}
			if (error instanceof ResourceAlreadyExists) {
				return HttpResponse.conflict(error.message);
			}
			if (error instanceof ResourceNotFound) {
				return HttpResponse.notFound(error.message);
			}
			return HttpResponse.serverError();
		}
	}
}
namespace RegisterAccountController {
	export type Request = RegisterAccountParams;
	export type Response = null;
}

export { RegisterAccountController };
