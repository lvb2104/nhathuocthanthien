// ============================================================================
// GET ALL BATCHES
// ============================================================================
export type GetAllBatchesResponse = Batch[];

// ============================================================================
// GET BATCH BY ID
// ============================================================================
export type GetBatchByIdResponse = Batch;

// ============================================================================
// CREATE BATCH
// ============================================================================
export type CreateBatchRequest = {
	productId: number;
	quantity: number;
	expiryDate: string;
	batchCode?: string;
	note?: string;
};

export type CreateBatchResponse = Batch;

// ============================================================================
// UPDATE BATCH
// ============================================================================
export type UpdateBatchRequest = Partial<CreateBatchRequest> & {
	receivedDate?: string;
};

export type UpdateBatchResponse = Batch;

// ============================================================================
// DISPOSE BATCH
// ============================================================================
export type DisposeBatchRequest = {
	note?: string;
};

export type DisposeBatchResponse = { message: string };

// ============================================================================
// DELETE BATCH
// ============================================================================
export type DeleteBatchResponse = { message: string };

// ============================================================================
// MODELS
// ============================================================================
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
