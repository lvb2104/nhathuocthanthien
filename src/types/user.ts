// Get User Profile
export type GetUserProfileResponse = UserInfo;

// Update User Profile
export type UpdateUserProfileRequest = FormData;

export type UpdateUserProfileResponse = {
	message: string;
};

// Get Shipping Addresses
export type GetShippingAddressesResponse = ShippingAddress[];

// Get Shipping Address By ID
export type GetShippingAddressByIdResponse = ShippingAddress;

// Create Shipping Address
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

// Update Shipping Address
export type UpdateShippingAddressRequest =
	Partial<CreateShippingAddressRequest>;

export type UpdateShippingAddressResponse = {
	message: string;
};

// Delete Shipping Address
export type DeleteShippingAddressResponse = {
	message: string;
};

// Change Password
export type ChangePasswordRequest = {
	currentPassword: string;
	newPassword: string;
};

export type ChangePasswordResponse = {
	message: string;
};

// Assign Account
export type AssignAccountRequest = {
	fullName: string;
	email: string;
	password: string;
	phone: string;
	role: UserRole;
};

export type AssignAccountResponse = {
	id: number;
	email: string;
	fullName: string;
	role: UserRole;
};

// Models
export type UserInfo = {
	id: number;
	email: string;
	fullName: string;
	phone: string;
	gender: string | null;
	birthDay: string | null;
	avatarUrl: string | null;
	roles: {
		id: number;
		name: string;
	}[];
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

export enum UserRole {
	CUSTOMER = 'customer',
	ADMIN = 'admin',
	PHARMACIST = 'pharmacist',
}
