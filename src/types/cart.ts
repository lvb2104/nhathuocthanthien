// ============================================================================
// GET CART
// ============================================================================
export type GetCartResponse = {
	id: number;
	userId: number;
	items: CartItem[];
};

// ============================================================================
// ADD ITEM TO CART
// ============================================================================
export type AddItemToCartRequest = {
	quantity: number;
};

export type AddItemToCartResponse = {
	message: string;
};

// ============================================================================
// UPDATE QUANTITY
// ============================================================================
export type UpdateQuantityRequest = {
	quantity: number;
};

export type UpdateQuantityResponse = {
	message: string;
};

// ============================================================================
// DELETE ITEM FROM CART
// ============================================================================
export type DeleteItemFromCartResponse = {
	message: string;
};

// ============================================================================
// CLEAR CART
// ============================================================================
export type ClearCartResponse = {
	message: string;
};

// ============================================================================
// MODELS
// ============================================================================
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
