// ============================================================================
// PAGINATION METADATA
// ============================================================================
export type PaginationMetadata = {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
};

export type PaginatedResponse<T> = {
	data: T[];
	pagination: PaginationMetadata;
};
