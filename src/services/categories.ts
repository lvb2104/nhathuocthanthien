import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import {
	CreateCategoryRequest,
	CreateCategoryResponse,
	DeleteCategoryResponse,
	GetCategoriesResponse,
	UpdateCategoryRequest,
	UpdateCategoryResponse,
} from '@/types';

export async function createCategory(
	request: CreateCategoryRequest,
): Promise<CreateCategoryResponse> {
	const res = await axiosInstance.post(apiEndpoints.categories.create, request);
	return res.data;
}

export async function getCategories(): Promise<GetCategoriesResponse> {
	const res = await axiosInstance.get(apiEndpoints.categories.getAll);
	return res.data;
}

export async function serverGetCategories(): Promise<GetCategoriesResponse> {
	const res = await serverAxios.get(apiEndpoints.categories.getAll);
	return res.data;
}

export async function updateCategory(
	id: number,
	request: UpdateCategoryRequest,
): Promise<UpdateCategoryResponse> {
	const res = await axiosInstance.put(
		apiEndpoints.categories.update(id),
		request,
	);
	return res.data;
}

export async function deleteCategory(
	id: number,
): Promise<DeleteCategoryResponse> {
	const res = await axiosInstance.delete(apiEndpoints.categories.delete(id));
	return res.data;
}
