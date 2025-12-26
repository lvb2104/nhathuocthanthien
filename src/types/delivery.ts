// Enums
export enum DeliveryStatus {
	PENDING = 'pending',
	PICKED_UP = 'picked_up',
	IN_TRANSIT = 'in_transit',
	DELIVERED = 'delivered',
	FAILED = 'failed',
}

// Models
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

// Request Types
export type CreateDeliveryRequest = {
	orderId: number;
	employeeId: number;
};

export type UpdateDeliveryStatusRequest = {
	status: DeliveryStatus;
};

export type UpdateDeliveryPartialRequest = Partial<Delivery>;

// Response Types
export type GetAllDeliveriesResponse = Delivery[];
export type GetDeliveriesByEmployeeResponse = Delivery[];
export type CreateDeliveryResponse = Delivery;
export type UpdateDeliveryResponse = Delivery;
