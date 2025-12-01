import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import { GetCategoriesResponse } from '@/types';

export async function getCategories(): Promise<GetCategoriesResponse> {
	const res = await axiosInstance.get(apiEndpoints.categories.getAll);
	return res.data;
}

export async function serverGetCategories(): Promise<GetCategoriesResponse> {
	const res = await serverAxios.get(apiEndpoints.categories.getAll);
	return res.data;
}
