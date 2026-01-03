import { apiEndpoints } from '@/configs/apis';
import { getServerSessionWithAuth } from '@/lib/auth';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import {
	CreateOrderRequest,
	CreateOrderResponse,
	GetAllOrdersResponse,
	GetOrderByIdResponse,
	UpdateOrderStatusRequest,
	UpdateOrderStatusResponse,
	CancelOrderResponse,
	OrderFilterParams,
} from '@/types';

export async function createOrder(
	request: CreateOrderRequest,
): Promise<CreateOrderResponse> {
	const res = await axiosInstance.post(apiEndpoints.orders.create, request);
	return res.data;
}

export async function getAllOrders(
	params?: OrderFilterParams,
): Promise<GetAllOrdersResponse> {
	const res = await axiosInstance.get(apiEndpoints.orders.getAll, { params });
	return res.data;
}

export async function serverGetOrders(
	params?: OrderFilterParams,
): Promise<GetAllOrdersResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(apiEndpoints.orders.getAll, {
		params,
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
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
	const res = await axiosInstance.patch(
		apiEndpoints.orders.updateStatus(id),
		request,
	);
	return res.data;
}

export async function cancelOrder(id: number): Promise<CancelOrderResponse> {
	const res = await axiosInstance.patch(apiEndpoints.orders.cancel(id));
	return res.data;
}
