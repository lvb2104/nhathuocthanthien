import { PaginatedResponse } from '.';

// ============================================================================
// GET CATEGORIES
// ============================================================================

export type GetCategoriesResponse = PaginatedResponse<Category>;

// ============================================================================
// CREATE CATEGORY
// ============================================================================
export type CreateCategoryRequest = {
	name: string;
};

export type CreateCategoryResponse = {
	message: string;
};

// ============================================================================
// UPDATE CATEGORY
// ============================================================================
export type UpdateCategoryRequest = {
	name: string;
};

export type UpdateCategoryResponse = {
	message: string;
};

// ============================================================================
// DELETE CATEGORY
// ============================================================================
export type DeleteCategoryResponse = {
	message: string;
};

// ============================================================================
// MODELS
// ============================================================================
export type Category = {
	id: number;
	name: string;
};
