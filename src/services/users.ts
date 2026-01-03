import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import { getServerSessionWithAuth } from '@/lib/auth';
import {
	AssignAccountRequest,
	AssignAccountResponse,
	ChangePasswordRequest,
	ChangePasswordResponse,
	CreateShippingAddressRequest,
	CreateShippingAddressResponse,
	DeleteShippingAddressResponse,
	GetAllUsersResponse,
	GetDeletedUsersResponse,
	GetShippingAddressByIdResponse,
	GetShippingAddressesResponse,
	GetUserProfileResponse,
	UpdateShippingAddressRequest,
	UpdateShippingAddressResponse,
	UpdateUserProfileRequest,
	UpdateUserProfileResponse,
	UserFilterParams,
} from '@/types';

// User profile operations
export async function getUserProfile(): Promise<GetUserProfileResponse> {
	const res = await axiosInstance.get(apiEndpoints.users.getProfile);
	return res.data;
}

export async function updateUserProfile(
	request: UpdateUserProfileRequest,
): Promise<UpdateUserProfileResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.users.updateProfile,
		request,
	);
	return res.data;
}

export async function changePassword(
	request: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.users.changePassword,
		request,
	);
	return res.data;
}

// Shipping addresses operations
export async function getShippingAddresses(): Promise<GetShippingAddressesResponse> {
	const res = await axiosInstance.get(
		apiEndpoints.users.shippingAddresses.getAll,
	);
	return res.data;
}

export async function getShippingAddressById(
	id: number,
): Promise<GetShippingAddressByIdResponse> {
	const res = await axiosInstance.get(
		apiEndpoints.users.shippingAddresses.getById(id),
	);
	return res.data;
}

export async function createShippingAddress(
	request: CreateShippingAddressRequest,
): Promise<CreateShippingAddressResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.users.shippingAddresses.create,
		request,
	);
	return res.data;
}

export async function updateShippingAddress(
	id: number,
	request: UpdateShippingAddressRequest,
): Promise<UpdateShippingAddressResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.users.shippingAddresses.update(id),
		request,
	);
	return res.data;
}

export async function deleteShippingAddress(
	id: number,
): Promise<DeleteShippingAddressResponse> {
	const res = await axiosInstance.delete(
		apiEndpoints.users.shippingAddresses.delete(id),
	);
	return res.data;
}

// Admin operations
export async function assignAccount(
	request: AssignAccountRequest,
): Promise<AssignAccountResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.users.assignAccount,
		request,
	);
	return res.data;
}

// Admin - Get all users
export async function getUsers(
	params?: UserFilterParams,
): Promise<GetAllUsersResponse> {
	const res = await axiosInstance.get(apiEndpoints.users.getAll, { params });
	return res.data;
}

// Admin - Get locked users
export async function getLockedUsers(
	params?: UserFilterParams,
): Promise<GetDeletedUsersResponse> {
	const res = await axiosInstance.get(apiEndpoints.users.getLocked, {
		params,
	});
	return res.data;
}

// Admin - Lock user (soft delete)
export async function lockUser(id: number): Promise<{ message: string }> {
	const res = await axiosInstance.delete(apiEndpoints.users.lock(id));
	return res.data;
}

// Admin - Restore locked user
export async function restoreUser(id: number): Promise<{ message: string }> {
	const res = await axiosInstance.patch(apiEndpoints.users.restore(id));
	return res.data;
}

// Server-side data fetching functions
export async function serverGetShippingAddresses(): Promise<GetShippingAddressesResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(
		apiEndpoints.users.shippingAddresses.getAll,
		{
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		},
	);
	return res.data;
}

// Admin - Server-side get users
export async function serverGetUsers(
	params?: UserFilterParams,
): Promise<GetAllUsersResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(apiEndpoints.users.getAll, {
		params,
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
	return res.data;
}
