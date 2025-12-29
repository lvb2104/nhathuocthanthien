// ============================================================================
// GET ALL ORDERS
// ============================================================================
export type GetAllOrdersResponse = Order[];

// ============================================================================
// GET ORDER BY ID
// ============================================================================
export type GetOrderByIdResponse = Order;

// ============================================================================
// CREATE ORDER
// ============================================================================
export type OrderItemRequest = {
	productId: number;
	quantity: number;
};

export type CreateOrderRequest = {
	items: OrderItemRequest[];
	paymentMethod?: PaymentMethod;
	userShippingAddressId: number;
	promotionId?: number;
};

export type CreateOrderResponse = {
	message: string;
	orderId: number;
	checkoutUrl?: string;
};

// ============================================================================
// UPDATE ORDER STATUS
// ============================================================================
export type UpdateOrderStatusRequest = {
	status: OrderStatus;
};

export type UpdateOrderStatusResponse = { message: string };

// ============================================================================
// CANCEL ORDER
// ============================================================================
export type CancelOrderResponse = { message: string };

// ============================================================================
// DELETE ORDER
// ============================================================================
export type DeleteOrderResponse = { message: string };

// ============================================================================
// MODELS
// ============================================================================
export type Order = {
	id: number;
	userId: number;
	status: OrderStatus;
	totalAmount: string;
	promotionId?: number;
	discountAmount?: string;
	finalAmount: string;
	user?: {
		id: number;
		fullName: string;
		email: string;
	};
	items: OrderItem[];
	payment?: Payment;
	promotion?: {
		id: number;
		code: string;
		description: string;
		discountPercent: string;
	};
	shipping?: OrderShipping;
	createdAt: string;
	updatedAt: string;
};

export type OrderItem = {
	id: number;
	orderId: number;
	productId: number;
	quantity: number;
	price: string;
	product?: {
		id: number;
		name: string;
		price: string;
		images: { id: number; imageUrl: string }[];
	};
};

export type Payment = {
	id: number;
	orderId: number;
	method: string;
	status: string;
	paidAt?: string;
	payosOrderCode?: string;
	payosPaymentLinkId?: string;
	payosCheckoutUrl?: string;
	payosTransactionId?: string;
};

export type OrderShipping = {
	id: number;
	orderId: number;
	fullName: string;
	phone: string;
	addressLine: string;
	ward?: string;
	district?: string;
	province?: string;
	note?: string;
};

// ============================================================================
// ENUMS
// ============================================================================
export enum OrderStatus {
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	DELIVERING = 'delivering',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
	FAILED = 'failed',
}

export enum PaymentMethod {
	CASH = 'cash',
	PAYOS = 'payos',
}

export enum PaymentStatus {
	PENDING = 'pending',
	PAID = 'paid',
	FAILED = 'failed',
	CANCELLED = 'cancelled',
}
