// Models
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

// Request Types
export type CreateReviewRequest = {
	rating: number; // 1-5
	comment?: string;
};

export type UpdateReviewRequest = {
	rating?: number;
	comment?: string;
};

// Response Types
export type GetAllReviewsResponse = Review[];
export type GetReviewByIdResponse = Review;
export type GetReviewsByProductResponse = Review[];
export type GetMyReviewsResponse = Review[];
export type CreateReviewResponse = Review;
export type UpdateReviewResponse = Review;
export type DeleteReviewResponse = { message: string };
