import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { GetCategoriesResponse } from '@/types';

export async function GetCategories(): Promise<GetCategoriesResponse> {
	const res = await axiosInstance.get(apiEndpoints.categories.getAll);
	return res.data;
}
