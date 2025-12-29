// ============================================================================
// GET ALL REVIEWS
// ============================================================================
export type GetAllReviewsResponse = Review[];

// ============================================================================
// GET REVIEW BY ID
// ============================================================================
export type GetReviewByIdResponse = Review;

// ============================================================================
// GET REVIEWS BY PRODUCT
// ============================================================================
export type GetReviewsByProductResponse = Review[];

// ============================================================================
// GET MY REVIEWS
// ============================================================================
export type GetMyReviewsResponse = Review[];

// ============================================================================
// CREATE REVIEW
// ============================================================================
export type CreateReviewRequest = {
	rating: number; // 1-5
	comment?: string;
};

export type CreateReviewResponse = Review;

// ============================================================================
// UPDATE REVIEW
// ============================================================================
export type UpdateReviewRequest = {
	rating?: number;
	comment?: string;
};

export type UpdateReviewResponse = Review;

// ============================================================================
// DELETE REVIEW
// ============================================================================
export type DeleteReviewResponse = { message: string };

// ============================================================================
// MODELS
// ============================================================================
export type Review = {
	id: number;
	userId: number;
	productId: number;
	rating: number;
	comment?: string;
	user?: {
		id: number;
		fullName: string;
	};
	createdAt: string;
	updatedAt: string;
};
