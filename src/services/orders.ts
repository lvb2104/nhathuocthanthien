import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	CreateOrderRequest,
	CreateOrderResponse,
	GetAllOrdersResponse,
	GetOrderByIdResponse,
	UpdateOrderStatusRequest,
	UpdateOrderStatusResponse,
	CancelOrderResponse,
	DeleteOrderResponse,
} from '@/types';

export async function createOrder(
	request: CreateOrderRequest,
): Promise<CreateOrderResponse> {
	const res = await axiosInstance.post(apiEndpoints.orders.create, request);
	return res.data;
}

export async function getAllOrders(): Promise<GetAllOrdersResponse> {
	const res = await axiosInstance.get(apiEndpoints.orders.getAll);
	return res.data;
}

export async function getOrderById(id: number): Promise<GetOrderByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.orders.getById(id));
	return res.data;
}

export async function updateOrderStatus(
	id: number,
	request: UpdateOrderStatusRequest,
): Promise<UpdateOrderStatusResponse> {
	const res = await axiosInstance.put(
		apiEndpoints.orders.updateStatus(id),
		request,
	);
	return res.data;
}

export async function cancelOrder(id: number): Promise<CancelOrderResponse> {
	const res = await axiosInstance.post(apiEndpoints.orders.cancel(id));
	return res.data;
}

export async function deleteOrder(id: number): Promise<DeleteOrderResponse> {
	const res = await axiosInstance.delete(apiEndpoints.orders.delete(id));
	return res.data;
}
