import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { CreateProductRequest, UpdateProductRequest } from '@/types';

export async function CreateProduct(
	createProductRequest: CreateProductRequest,
) {
	const res = await axiosInstance.post(
		apiEndpoints.products.create,
		createProductRequest,
	);
	return res.data;
}

export async function GetProducts() {
	const res = await axiosInstance.get(apiEndpoints.products.getAll);
	return res.data;
}

export async function GetProductById(id: number) {
	const res = await axiosInstance.get(apiEndpoints.products.getById(id));
	return res.data;
}

export async function UpdateProduct({
	id,
	updateProductRequest,
}: {
	id: number;
	updateProductRequest: UpdateProductRequest;
}) {
	const res = await axiosInstance.put(
		apiEndpoints.products.update(id),
		updateProductRequest,
	);
	return res.data;
}

export async function DeleteProduct(id: number) {
	const res = await axiosInstance.delete(apiEndpoints.products.delete(id));
	return res.data;
}
