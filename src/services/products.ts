import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { CreateProductRequest } from '@/types';

export async function CreateProduct(
	createProductRequest: CreateProductRequest,
) {
	const res = await axiosInstance.post(
		apiEndpoints.products.create,
		createProductRequest,
	);
	return res.data;
}
