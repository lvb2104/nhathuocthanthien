// Enums
export enum PrescriptionStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}

// Models
export type PrescriptionItem = {
	productId: number;
	quantity: number;
	product?: {
		id: number;
		name: string;
		price: string;
	};
};

export type Prescription = {
	id: number;
	userId: number;
	imageUrl: string;
	status: PrescriptionStatus;
	items?: PrescriptionItem[];
	approvedBy?: number;
	createdAt: string;
	updatedAt: string;
	approver?: {
		id: number;
		fullName: string;
	};
};

// Request Types
export type CreatePrescriptionRequest = FormData; // File upload

export type ApprovePrescriptionRequest = {
	items: { productId: number; quantity: number }[];
};

// Response Types
export type GetMyPrescriptionsResponse = Prescription[];
export type GetMyPrescriptionByIdResponse = Prescription;
export type GetApprovedPrescriptionResponse = Prescription | null;
export type GetAllPrescriptionsForPharmacistResponse = Prescription[];
export type CreatePrescriptionResponse = Prescription;
export type ApprovePrescriptionResponse = { message: string };
export type RejectPrescriptionResponse = { message: string };
