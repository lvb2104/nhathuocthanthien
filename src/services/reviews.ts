import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	CreateReviewRequest,
	CreateReviewResponse,
	UpdateReviewRequest,
	UpdateReviewResponse,
	GetAllReviewsResponse,
	GetReviewByIdResponse,
	GetReviewsByProductResponse,
	GetMyReviewsResponse,
	DeleteReviewResponse,
} from '@/types';

export async function createReview(
	productId: number,
	request: CreateReviewRequest,
): Promise<CreateReviewResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.reviews.create(productId),
		request,
	);
	return res.data;
}

export async function getAllReviews(): Promise<GetAllReviewsResponse> {
	const res = await axiosInstance.get(apiEndpoints.reviews.getAll);
	return res.data;
}

export async function getReviewById(
	id: number,
): Promise<GetReviewByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.reviews.getById(id));
	return res.data;
}

export async function getReviewsByProduct(
	productId: number,
): Promise<GetReviewsByProductResponse> {
	const res = await axiosInstance.get(
		apiEndpoints.reviews.getByProduct(productId),
	);
	return res.data;
}

export async function getMyReviews(): Promise<GetMyReviewsResponse> {
	const res = await axiosInstance.get(apiEndpoints.reviews.getMy);
	return res.data;
}

export async function updateReview(
	id: number,
	request: UpdateReviewRequest,
): Promise<UpdateReviewResponse> {
	const res = await axiosInstance.put(apiEndpoints.reviews.update(id), request);
	return res.data;
}

export async function deleteReview(id: number): Promise<DeleteReviewResponse> {
	const res = await axiosInstance.delete(apiEndpoints.reviews.delete(id));
	return res.data;
}
