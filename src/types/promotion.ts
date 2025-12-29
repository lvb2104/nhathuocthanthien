// ============================================================================
// GET PROMOTIONS
// ============================================================================
export type GetPromotionsResponse = Promotion[];

// ============================================================================
// GET PROMOTION BY ID
// ============================================================================
export type GetPromotionByIdResponse = Promotion;

// ============================================================================
// CREATE PROMOTION
// ============================================================================
export type CreatePromotionRequest = {
	code: string;
	description: string;
	discountPercent: number;
	startDate: string;
	endDate: string;
};

export type CreatePromotionResponse = {
	message: string;
};

// ============================================================================
// UPDATE PROMOTION
// ============================================================================
export type UpdatePromotionRequest = Partial<CreatePromotionRequest>;

export type UpdatePromotionResponse = {
	message: string;
};

// ============================================================================
// DELETE PROMOTION
// ============================================================================
export type DeletePromotionResponse = {
	message: string;
};

// ============================================================================
// MODELS
// ============================================================================
export type Promotion = {
	id: number;
	code: string;
	description: string;
	discountPercent: number;
	startDate: string;
	endDate: string;
};
