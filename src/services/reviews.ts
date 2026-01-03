import { apiEndpoints } from '@/configs/apis';
import { getServerSessionWithAuth } from '@/lib/auth';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
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
	ReviewFilterParams,
	ProductReviewFilterParams,
	MyReviewsFilterParams,
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

export async function getAllReviews(
	params?: ReviewFilterParams,
): Promise<GetAllReviewsResponse> {
	const res = await axiosInstance.get(apiEndpoints.reviews.getAll, { params });
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
	params?: ProductReviewFilterParams,
): Promise<GetReviewsByProductResponse> {
	const res = await axiosInstance.get(
		apiEndpoints.reviews.getByProduct(productId),
		{ params },
	);
	return res.data;
}

export async function getMyReviews(
	params?: MyReviewsFilterParams,
): Promise<GetMyReviewsResponse> {
	const res = await axiosInstance.get(apiEndpoints.reviews.getMy, { params });
	return res.data;
}

export async function updateReview(
	id: number,
	request: UpdateReviewRequest,
): Promise<UpdateReviewResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.reviews.update(id),
		request,
	);
	return res.data;
}

export async function deleteReview(id: number): Promise<DeleteReviewResponse> {
	const res = await axiosInstance.delete(apiEndpoints.reviews.delete(id));
	return res.data;
}

// Server-side function for Next.js server components
export async function serverGetReviews(
	params?: ReviewFilterParams,
): Promise<GetAllReviewsResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(apiEndpoints.reviews.getAll, {
		params,
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
	return res.data;
}
