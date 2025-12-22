import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import { getServerSessionWithAuth } from '@/lib/auth';
import {
	CreatePromotionRequest,
	CreatePromotionResponse,
	DeletePromotionResponse,
	GetPromotionByIdResponse,
	GetPromotionsResponse,
	UpdatePromotionRequest,
	UpdatePromotionResponse,
} from '@/types';

export async function getPromotions(): Promise<GetPromotionsResponse> {
	const res = await axiosInstance.get(apiEndpoints.promotions.getAll);
	return res.data;
}

export async function getPromotionById(
	id: number,
): Promise<GetPromotionByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.promotions.getById(id));
	return res.data;
}

export async function createPromotion(
	request: CreatePromotionRequest,
): Promise<CreatePromotionResponse> {
	const res = await axiosInstance.post(apiEndpoints.promotions.create, request);
	return res.data;
}

export async function updatePromotion(
	id: number,
	request: UpdatePromotionRequest,
): Promise<UpdatePromotionResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.promotions.update(id),
		request,
	);
	return res.data;
}

export async function deletePromotion(
	id: number,
): Promise<DeletePromotionResponse> {
	const res = await axiosInstance.delete(apiEndpoints.promotions.delete(id));
	return res.data;
}

export async function serverGetPromotions(): Promise<GetPromotionsResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(apiEndpoints.promotions.getAll, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
	return res.data;
}
