// Models
export type Batch = {
	id: number;
	productId: number;
	quantity: number;
	batchCode?: string;
	expiryDate: string;
	receivedDate?: string;
	disposedDate?: string;
	note?: string;
	product?: {
		id: number;
		name: string;
	};
};

// Request Types
export type CreateBatchRequest = {
	productId: number;
	quantity: number;
	expiryDate: string;
	batchCode?: string;
	note?: string;
};

export type UpdateBatchRequest = Partial<CreateBatchRequest> & {
	receivedDate?: string;
};

export type DisposeBatchRequest = {
	note?: string;
};

// Response Types
export type GetAllBatchesResponse = Batch[];
export type GetBatchByIdResponse = Batch;
export type CreateBatchResponse = Batch;
export type UpdateBatchResponse = Batch;
export type DisposeBatchResponse = { message: string };
export type DeleteBatchResponse = { message: string };
