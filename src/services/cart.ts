import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	AddItemToCartRequest,
	AddItemToCartResponse,
	ClearCartResponse,
	DeleteItemFromCartResponse,
	GetCartResponse,
	UpdateQuantityRequest,
	UpdateQuantityResponse,
} from '@/types';

export async function getCart(): Promise<GetCartResponse> {
	const res = await axiosInstance.get(apiEndpoints.cart.get);
	return res.data;
}

export async function deleteCart(): Promise<ClearCartResponse> {
	const res = await axiosInstance.delete(apiEndpoints.cart.clear);
	return res.data;
}

export async function addItemToCart(
	id: number,
	addItemToCartRequest: AddItemToCartRequest,
): Promise<AddItemToCartResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.cart.addItem(id),
		addItemToCartRequest,
	);
	return res.data;
}

export async function updateQuantity(
	id: number,
	updateQuantityRequest: UpdateQuantityRequest,
): Promise<UpdateQuantityResponse> {
	const res = await axiosInstance.put(
		apiEndpoints.cart.updateQuantity(id),
		updateQuantityRequest,
	);
	return res.data;
}

export async function deleteItemFromCart(
	id: number,
): Promise<DeleteItemFromCartResponse> {
	const res = await axiosInstance.delete(apiEndpoints.cart.deleteItem(id));
	return res.data;
}
