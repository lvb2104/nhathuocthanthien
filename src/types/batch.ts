import { PaginatedResponse } from '.';

// ============================================================================
// GET ALL BATCHES
// ============================================================================
export type GetAllBatchesResponse = PaginatedResponse<Batch>;

export type BatchFilterParams = {
	page?: number;
	limit?: number;
	productId?: number;
	status?: BatchStatus;
	expired?: boolean;
	keyword?: string;
};

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

export type DisposeBatchResponse = Batch;

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
	disposedAt?: string;
	status?: BatchStatus;
	note?: string;
	product?: {
		id: number;
		name: string;
	};
};

// ============================================================================
// ENUMS
// ============================================================================
export enum BatchStatus {
	ACTIVE = 'active',
	DISPOSED = 'disposed',
}
