// Cart Item structure from backend
export type CartItem = {
	productId: number;
	quantity: number;
	product: {
		id: number;
		name: string;
		price: string;
		description?: string;
		images?: Array<{ id: number; imageUrl: string }>;
	};
};

// Requests
export type AddItemToCartRequest = {
	quantity: number;
};

export type UpdateQuantityRequest = {
	quantity: number;
};

// Responses
export type GetCartResponse = {
	items: CartItem[];
	totalPrice: string;
};

export type AddItemToCartResponse = {
	item: CartItem;
	totalPrice: string;
};

export type UpdateQuantityResponse = {
	item: CartItem;
	totalPrice: string;
};

export type DeleteItemFromCartResponse = {
	totalPrice: string;
};

export type ClearCartResponse = {
	totalPrice: string;
};
