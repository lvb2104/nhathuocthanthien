import { PaginatedResponse } from '.';

// ============================================================================
// GET ALL ORDERS
// ============================================================================
export type GetAllOrdersResponse = PaginatedResponse<Order>;

export type OrderFilterParams = {
	page?: number;
	limit?: number;
	status?: OrderStatus;
	userId?: number;
	paymentStatus?: PaymentStatus;
	fromDate?: string;
	toDate?: string;
	keyword?: string;
};

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
	orderDate: string;
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
		description?: string;
		discountPercent: number;
	};
	shipping?: OrderShipping;
};

export type OrderItem = {
	id: number;
	orderId: number;
	productId: number;
	quantity: number;
	price: string;
	product?: {
		id: number;
		categoryId: number;
		name: string;
		description: string | null;
		price: string;
		manufacturer: string | null;
		createdAt: string;
		updatedAt: string;
		deletedAt: string | null;
	};
};

export type Payment = {
	id: number;
	orderId: number;
	method: PaymentMethod;
	status: PaymentStatus;
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
	SHIPPED = 'shipped',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled',
}

export enum PaymentMethod {
	CASH = 'cash',
	PAYOS = 'payos',
}

export enum PaymentStatus {
	PENDING = 'pending',
	PAID = 'paid',
	FAILED = 'failed',
	REFUNDED = 'refunded',
}
