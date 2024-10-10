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
	public static badRequest(errors: Errors): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 400,
			data: null,
			errors,
			message: 'Invalid parameters provided.',
		});
	}
	public static serverError(): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 500,
			data: null,
			message: 'INTERNAL_SERVER_ERROR',
		});
	}
	public static created<T>(data: T): ApiResponse<T> {
		return HttpResponse.buildResponse({
			statusCode: 201,
			data,
		});
	}
	public static ok<T>(data: T): ApiResponse<T> {
		return HttpResponse.buildResponse({
			statusCode: 200,
			data,
		});
	}
	public static notFound(): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 404,
			data: null,
			message: 'NOT_FOUND',
		});
	}
	public static unauthorized(): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 401,
			data: null,
			message: 'UNAUTHORIZED',
		});
	}
	public static forbidden(): ApiResponse<null> {
		return HttpResponse.buildResponse({
			statusCode: 403,
			data: null,
			message: 'FORBIDDEN',
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
			statusCode: input.statusCode,
		};
	}
}

export { HttpResponse };
