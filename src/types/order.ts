// Enums
export enum OrderStatus {
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	DELIVERING = 'delivering',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
	FAILED = 'failed',
}

// Models
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

// Request Types
export type OrderItemRequest = {
	productId: number;
	quantity: number;
};

export type CreateOrderRequest = {
	items: OrderItemRequest[];
	paymentMethod?: string;
	userShippingAddressId: number;
	promotionId?: number;
};

export type UpdateOrderStatusRequest = {
	status: OrderStatus;
};

// Response Types
export type GetAllOrdersResponse = Order[];
export type GetOrderByIdResponse = Order;
export type CreateOrderResponse = {
	message: string;
	orderId: number;
	checkoutUrl?: string;
};
export type UpdateOrderStatusResponse = { message: string };
export type CancelOrderResponse = { message: string };
export type DeleteOrderResponse = { message: string };
