import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	CreateDeliveryResponse,
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

export async function getAllDeliveries(): Promise<GetAllDeliveriesResponse> {
	const res = await axiosInstance.get(apiEndpoints.delivery.getAll);
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
	const res = await axiosInstance.put(
		apiEndpoints.delivery.updateStatus(id),
		request,
	);
	return res.data;
}

export async function updateDeliveryPartial(
	id: number,
	request: UpdateDeliveryPartialRequest,
): Promise<UpdateDeliveryResponse> {
	const res = await axiosInstance.put(
		apiEndpoints.delivery.updatePartial(id),
		request,
	);
	return res.data;
}
