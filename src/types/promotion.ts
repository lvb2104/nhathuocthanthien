// Models
export type Promotion = {
	id: number;
	code: string;
	description: string;
	discountPercent: number;
	startDate: string;
	endDate: string;
};

// Requests
export type CreatePromotionRequest = {
	code: string;
	description: string;
	discountPercent: number;
	startDate: string;
	endDate: string;
};

export type UpdatePromotionRequest = Partial<CreatePromotionRequest>;

// Responses
export type GetPromotionsResponse = Promotion[];

export type GetPromotionByIdResponse = Promotion;

export type CreatePromotionResponse = {
	message: string;
};

export type UpdatePromotionResponse = {
	message: string;
};

export type DeletePromotionResponse = {
	message: string;
};
