import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	CreateDeliveryResponse,
	DeliveryFilterParams,
	UpdateDeliveryStatusRequest,
	UpdateDeliveryPartialRequest,
	UpdateDeliveryResponse,
	GetAllDeliveriesResponse,
	GetDeliveriesByEmployeeResponse,
} from '@/types';

export async function createDelivery(
	orderId: number,
	employeeId: number,
): Promise<CreateDeliveryResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.delivery.create(orderId, employeeId),
	);
	return res.data;
}

export async function getAllDeliveries(
	params?: DeliveryFilterParams,
): Promise<GetAllDeliveriesResponse> {
	const res = await axiosInstance.get(apiEndpoints.delivery.getAll, { params });
	return res.data;
}

export async function getDeliveriesByEmployee(): Promise<GetDeliveriesByEmployeeResponse> {
	const res = await axiosInstance.get(apiEndpoints.delivery.getByEmployee);
	return res.data;
}

export async function updateDeliveryStatus(
	id: number,
	request: UpdateDeliveryStatusRequest,
): Promise<UpdateDeliveryResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.delivery.updateStatus(id),
		request,
	);
	return res.data;
}

export async function updateDeliveryPartial(
	id: number,
	request: UpdateDeliveryPartialRequest,
): Promise<UpdateDeliveryResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.delivery.updatePartial(id),
		request,
	);
	return res.data;
}
