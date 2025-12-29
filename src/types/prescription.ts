// ============================================================================
// GET MY PRESCRIPTIONS
// ============================================================================
export type GetMyPrescriptionsResponse = Prescription[];

// ============================================================================
// GET MY PRESCRIPTION BY ID
// ============================================================================
export type GetMyPrescriptionByIdResponse = Prescription;

// ============================================================================
// GET APPROVED PRESCRIPTION
// ============================================================================
export type GetApprovedPrescriptionResponse = Prescription | null;

// ============================================================================
// GET ALL PRESCRIPTIONS FOR PHARMACIST
// ============================================================================
export type GetAllPrescriptionsForPharmacistResponse = Prescription[];

// ============================================================================
// CREATE PRESCRIPTION
// ============================================================================
export type CreatePrescriptionRequest = FormData; // File upload

export type CreatePrescriptionResponse = Prescription;

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

// ============================================================================
// ENUMS
// ============================================================================
export enum PrescriptionStatus {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected',
}
