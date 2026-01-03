import { PaginatedResponse } from '.';

// ============================================================================
// GET USER PROFILE
// ============================================================================
export type GetUserProfileResponse = UserInfo;

// ============================================================================
// UPDATE USER PROFILE
// ============================================================================
export type UpdateUserProfileRequest = FormData;

export type UpdateUserProfileResponse = {
	message: string;
};

// ============================================================================
// GET SHIPPING ADDRESSES
// ============================================================================
export type GetShippingAddressesResponse = ShippingAddress[];

// ============================================================================
// GET SHIPPING ADDRESS BY ID
// ============================================================================
export type GetShippingAddressByIdResponse = ShippingAddress;

// ============================================================================
// CREATE SHIPPING ADDRESS
// ============================================================================
export type CreateShippingAddressRequest = {
	fullName: string;
	phone: string;
	addressLine: string;
	ward?: string;
	district?: string;
	province?: string;
	note?: string;
	isDefault?: boolean;
};

export type CreateShippingAddressResponse = {
	message: string;
};

// ============================================================================
// UPDATE SHIPPING ADDRESS
// ============================================================================
export type UpdateShippingAddressRequest =
	Partial<CreateShippingAddressRequest>;

export type UpdateShippingAddressResponse = {
	message: string;
};

// ============================================================================
// DELETE SHIPPING ADDRESS
// ============================================================================
export type DeleteShippingAddressResponse = {
	message: string;
};

// ============================================================================
// CHANGE PASSWORD
// ============================================================================
export type ChangePasswordRequest = {
	currentPassword: string;
	newPassword: string;
};

export type ChangePasswordResponse = {
	message: string;
};

// ============================================================================
// ASSIGN ACCOUNT
// ============================================================================
export type AssignAccountRequest = {
	fullName: string;
	email: string;
	password: string;
	phone?: string;
	roleId: number;
	hireDate?: string; // Required for employee role
	licenseNumber?: string; // Required for pharmacist role
};

export type AssignAccountResponse = {
	id: number;
	email: string;
	fullName: string;
	role: string;
};

// ============================================================================
// GET ALL USERS (Admin)
// ============================================================================
export type GetAllUsersResponse = PaginatedResponse<UserInfo>;

export type UserFilterParams = {
	page?: number;
	limit?: number;
	keyword?: string; // Search in email/full_name
	role?: UserRole;
	isActive?: boolean;
	includeDeleted?: boolean; // Show deleted users
};

// ============================================================================
// GET DELETED USERS (Admin)
// ============================================================================
export type GetDeletedUsersResponse = PaginatedResponse<UserInfo>;

// ============================================================================
// MODELS
// ============================================================================
export type UserInfo = {
	id: number;
	email: string;
	fullName: string;
	phone: string;
	gender: UserGender | null;
	birthDay: string | null;
	avatarUrl: string | null;
	roles: {
		id: number;
		name: string;
	};
};

export type ShippingAddress = {
	id: number;
	fullName: string;
	phone: string;
	addressLine: string;
	ward: string;
	district: string;
	province: string;
	note: string | null;
	isDefault: boolean;
};

// ============================================================================
// ENUMS
// ============================================================================
export enum UserGender {
	MALE = 'male',
	FEMALE = 'female',
	OTHER = 'other',
}

export enum UserRole {
	CUSTOMER = 'customer',
	ADMIN = 'admin',
	PHARMACIST = 'pharmacist',
	EMPLOYEE = 'employee',
}
