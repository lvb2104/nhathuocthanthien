import { PaginatedResponse } from '.';

// ============================================================================
// GET ALL STOCK MOVEMENTS
// ============================================================================
export type GetAllStockMovementsResponse = PaginatedResponse<StockMovement>;

export type StockMovementFilterParams = {
	page?: number;
	limit?: number;
	productId?: number;
	batchId?: number;
	movementType?: MovementType;
	fromDate?: string; // ISO date string
	toDate?: string; // ISO date string
};

// ============================================================================
// GET STOCK MOVEMENTS BY PRODUCT
// ============================================================================
export type GetStockMovementsByProductResponse =
	PaginatedResponse<StockMovement>;

export type StockMovementByProductParams = {
	page?: number;
	limit?: number;
	movementType?: MovementType;
};

// ============================================================================
// MODELS
// ============================================================================
export type StockMovement = {
	id: number;
	productId: number;
	batchId?: number;
	movementType: MovementType;
	quantity: number;
	referenceId?: number;
	createdAt: string;
	note?: string;
	product?: {
		id: number;
		name: string;
	};
	batch?: {
		id: number;
		batchCode: string;
		expiryDate: string;
	};
};

// ============================================================================
// ENUMS
// ============================================================================
export enum MovementType {
	SALE = 'sale',
	CANCEL = 'cancel',
	IMPORT = 'import',
	ADJUST_INCREASE = 'adjust_increase',
	ADJUST_DECREASE = 'adjust_decrease',
	DISPOSE = 'dispose',
}
