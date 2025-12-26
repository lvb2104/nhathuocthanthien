// Get Cart
export type GetCartResponse = {
	id: number;
	userId: number;
	items: CartItem[];
};

// Add Item to Cart
export type AddItemToCartRequest = {
	quantity: number;
};

export type AddItemToCartResponse = {
	message: string;
};

// Update Quantity
export type UpdateQuantityRequest = {
	quantity: number;
};

export type UpdateQuantityResponse = {
	message: string;
};

// Delete Item from Cart
export type DeleteItemFromCartResponse = {
	message: string;
};

// Clear Cart
export type ClearCartResponse = {
	message: string;
};

// Models
export type CartItem = {
	id: number;
	productId: number;
	quantity: number;
	product: {
		id: number;
		name: string;
		price: string;
		manufacturer: string;
		images: { id: number; imageUrl: string }[];
	};
};
