import { messages } from '@/application/errors/message';
import type { ApiResponse, Errors, MetaData } from './interface/api-response';
type BuildResponse<T> = {
	statusCode: number;
	message?: string;
	data: T;
	errors?: Errors;
	meta?: MetaData;
};
class HttpResponse {
	public static noContent(): ApiResponse<null> {
		return HttpResponse.buildResponse({ statusCode: 202, data: null });
	}
	public static badRequest(message: string, errors: Errors): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 400,
			data: null,
			errors,
			message,
		});
	}
	public static serverError(): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 500,
			data: null,
			message: messages.INTERNAL_SERVER_ERROR,
		});
	}
	public static created<T>(message: string, data: T): ApiResponse<T> {
		return HttpResponse.buildResponse({
			statusCode: 201,
			data,
			message,
		});
	}
	public static ok<T>(message: string, data: T): ApiResponse<T> {
		return HttpResponse.buildResponse({
			statusCode: 200,
			data,
			message,
		});
	}
	public static notFound(message: string): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 404,
			data: null,
			message,
		});
	}
	public static unauthorized(message: string): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 401,
			data: null,
			message,
		});
	}
	public static forbidden(message: string): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 403,
			data: null,
			message,
		});
	}
	public static conflict(message: string): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 409,
			data: null,
			message,
		});
	}

	private static buildResponse<T>(input: BuildResponse<T>): ApiResponse<T> {
		return {
			data: input.data,
			errors: input?.errors ?? null,
			message: input.message ?? null,
			meta: input.meta ?? null,
			body: null,
			statusCode: input.statusCode,
		};
	}
}

export { HttpResponse };
