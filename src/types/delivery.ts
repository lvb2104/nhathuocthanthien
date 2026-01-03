import { PaginatedResponse } from '.';

// ============================================================================
// GET ALL DELIVERIES
// ============================================================================
export type GetAllDeliveriesResponse = PaginatedResponse<Delivery>;

export type DeliveryFilterParams = {
	page?: number;
	limit?: number;
	status?: DeliveryStatus;
	orderId?: number;
	employeeId?: number;
	keyword?: string; // Search employee name/email
};

// ============================================================================
// GET DELIVERIES BY EMPLOYEE
// ============================================================================
export type GetDeliveriesByEmployeeResponse = PaginatedResponse<Delivery>;

// ============================================================================
// CREATE DELIVERY
// ============================================================================
export type CreateDeliveryRequest = {
	orderId: number;
	employeeId: number;
};

export type CreateDeliveryResponse = { message: string };

// ============================================================================
// UPDATE DELIVERY STATUS
// ============================================================================
export type UpdateDeliveryStatusRequest = {
	status: DeliveryStatus;
};

export type UpdateDeliveryResponse = { message: string };

// ============================================================================
// UPDATE DELIVERY (PARTIAL) - Admin only
// ============================================================================
export type UpdateDeliveryPartialRequest = Partial<Delivery>;

export type UpdateDeliveryPartialResponse = {
	message: string;
	delivery: Delivery;
};

// ============================================================================
// MODELS
// ============================================================================
export type Delivery = {
	id: number;
	orderId: number;
	employeeId: number;
	status: DeliveryStatus;
	updatedAt: string;
	employee?: {
		id: number;
		fullName: string;
		email?: string;
	};
	order?: {
		id: number;
		userId: number;
		promotionId?: number;
		orderDate: string;
		status: string;
		totalAmount: string;
		discountAmount?: string;
		finalAmount: string;
	};
};

// ============================================================================
// ENUMS
// ============================================================================
export enum DeliveryStatus {
	ASSIGNED = 'assigned',
	SHIPPING = 'shipping',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled',
}
