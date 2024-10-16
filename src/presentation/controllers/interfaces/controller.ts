import type { ApiResponse } from '@/presentation/helpers/interface/api-response';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface Controller<RequestType = any, ResponseType = any> {
	handle(request?: RequestType): Promise<ApiResponse<ResponseType>>;
}
