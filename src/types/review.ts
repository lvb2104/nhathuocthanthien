import { PaginatedResponse } from '.';

// ============================================================================
// GET ALL REVIEWS
// ============================================================================
export type GetAllReviewsResponse = PaginatedResponse<Review>;

export type ReviewFilterParams = {
	page?: number;
	limit?: number;
	rating?: number;
	productId?: number;
	userId?: number;
	keyword?: string; // Search in comment
};

// ============================================================================
// GET REVIEW BY ID
// ============================================================================
export type GetReviewByIdResponse = Review;

// ============================================================================
// GET REVIEWS BY PRODUCT
// ============================================================================
export type GetReviewsByProductResponse = PaginatedResponse<Review>;

export type ProductReviewFilterParams = {
	page?: number;
	limit?: number;
	rating?: number;
	keyword?: string; // Search in comment
};

// ============================================================================
// GET MY REVIEWS
// ============================================================================
export type GetMyReviewsResponse = PaginatedResponse<Review>;

export type MyReviewsFilterParams = {
	page?: number;
	limit?: number;
	keyword?: string; // Search in comment
};

// ============================================================================
// CREATE REVIEW
// ============================================================================
export type CreateReviewRequest = {
	rating: number; // 1-5
	comment?: string;
};

export type CreateReviewResponse = { message: string };

// ============================================================================
// UPDATE REVIEW
// ============================================================================
export type UpdateReviewRequest = {
	rating?: number;
	comment?: string;
};

export type UpdateReviewResponse = { message: string };

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
