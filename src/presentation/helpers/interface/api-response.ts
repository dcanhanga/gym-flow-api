interface ApiResponse<T> {
	statusCode: number;
	message: string | null;
	data: T;
	body: unknown;
	errors: Errors | null;
	meta: MetaData | null;
}

type MetaData = {
	pagination?: PaginationData;
	timestamp?: string;
	version?: string;
	links?: LinksData;
};

type PaginationData = {
	total: number;
	perPage: number;
	currentPage: number;
	totalPages: number;
};

type LinksData = {
	self: string;
	next?: string;
	prev?: string;
};
type Errors = { [key: string]: string };
export type { ApiResponse, MetaData, Errors };
