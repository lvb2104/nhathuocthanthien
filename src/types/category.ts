// Requests
export type CreateCategoryRequest = {
	name: string;
};

export type UpdateCategoryRequest = {
	name: string;
};

// Responses
export type CreateCategoryResponse = {
	message: string;
};

export type GetCategoriesResponse = Category[];

export type UpdateCategoryResponse = {
	message: string;
};

export type DeleteCategoryResponse = {
	message: string;
};

// Models
export type Category = {
	id: number;
	name: string;
};
