import { PaginatedResponse } from '.';

// ============================================================================
// GET MY PRESCRIPTIONS
// ============================================================================
export type GetMyPrescriptionsResponse = PaginatedResponse<Prescription>;

export type MyPrescriptionsFilterParams = {
	page?: number;
	limit?: number;
	status?: PrescriptionStatus;
	fromDate?: string;
	toDate?: string;
};

// ============================================================================
// GET MY PRESCRIPTION BY ID
// ============================================================================
export type GetMyPrescriptionByIdResponse = Prescription;

export type GetApprovedPrescriptionResponse = PaginatedResponse<Prescription>;

export type GetAllPrescriptionsForPharmacistResponse =
	PaginatedResponse<Prescription>;

export type PharmacistPrescriptionsFilterParams = {
	page?: number;
	limit?: number;
	status?: PrescriptionStatus;
	keyword?: string; // Search in user full_name
	fromDate?: string;
	toDate?: string;
	userId?: number;
};

// ============================================================================
// CREATE PRESCRIPTION
// ============================================================================
export type CreatePrescriptionRequest = FormData; // File upload

export type CreatePrescriptionResponse = {
	message: string;
	prescription: Prescription;
};

// ============================================================================
// APPROVE PRESCRIPTION
// ============================================================================
export type ApprovePrescriptionRequest = {
	items: { productId: number; quantity: number }[];
};

export type ApprovePrescriptionResponse = { message: string };

// ============================================================================
// REJECT PRESCRIPTION
// ============================================================================
export type RejectPrescriptionResponse = { message: string };

// ============================================================================
// MODELS
// ============================================================================
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
	fileUrl: string;
	status: PrescriptionStatus;
	items?: PrescriptionItem[];
	pharmacistId?: number;
	uploadedAt: string;
	pharmacist?: {
		id: number;
		fullName: string;
	};
};

// ============================================================================
// ENUMS
// ============================================================================
export enum PrescriptionStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}
