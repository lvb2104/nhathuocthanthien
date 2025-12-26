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
	GetShippingAddressByIdResponse,
	GetShippingAddressesResponse,
	GetUserProfileResponse,
	UpdateShippingAddressRequest,
	UpdateShippingAddressResponse,
	UpdateUserProfileRequest,
	UpdateUserProfileResponse,
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
