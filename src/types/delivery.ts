// ============================================================================
// GET ALL DELIVERIES
// ============================================================================
export type GetAllDeliveriesResponse = Delivery[];

// ============================================================================
// GET DELIVERIES BY EMPLOYEE
// ============================================================================
export type GetDeliveriesByEmployeeResponse = Delivery[];

// ============================================================================
// CREATE DELIVERY
// ============================================================================
export type CreateDeliveryRequest = {
	orderId: number;
	employeeId: number;
};

export type CreateDeliveryResponse = Delivery;

// ============================================================================
// UPDATE DELIVERY STATUS
// ============================================================================
export type UpdateDeliveryStatusRequest = {
	status: DeliveryStatus;
};

export type UpdateDeliveryResponse = Delivery;

// ============================================================================
// UPDATE DELIVERY (PARTIAL)
// ============================================================================
export type UpdateDeliveryPartialRequest = Partial<Delivery>;

// ============================================================================
// MODELS
// ============================================================================
export type Delivery = {
	id: number;
	orderId: number;
	employeeId: number;
	status: DeliveryStatus;
	assignedAt: string;
	deliveredAt?: string;
	employee?: {
		id: number;
		fullName: string;
	};
};

// ============================================================================
// ENUMS
// ============================================================================
export enum DeliveryStatus {
	PENDING = 'pending',
	PICKED_UP = 'picked_up',
	IN_TRANSIT = 'in_transit',
	DELIVERED = 'delivered',
	FAILED = 'failed',
}
