import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';

export async function GetCategories() {
	const res = await axiosInstance.get(apiEndpoints.categories.getAll);
	return res.data;
}
