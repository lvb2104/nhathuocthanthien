import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import {
	CreateProductRequest,
	CreateProductResponse,
	DeleteProductResponse,
	GetProductByIdResponse,
	GetProductsResponse,
	UpdateProductRequest,
	UpdateProductResponse,
} from '@/types';

export async function createProduct(
	createProductRequest: CreateProductRequest,
): Promise<CreateProductResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.products.create,
		createProductRequest,
	);
	return res.data;
}

export async function getProducts(): Promise<GetProductsResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.getAll);
	return res.data;
}

export async function serverGetProducts(): Promise<GetProductsResponse> {
	const res = await serverAxios.get(apiEndpoints.products.getAll);
	return res.data;
}

export async function getProductById(
	id: number,
): Promise<GetProductByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.getById(id));
	return res.data;
}

export async function serverGetProductById(
	id: number,
): Promise<GetProductByIdResponse> {
	const res = await serverAxios.get(apiEndpoints.products.getById(id));
	return res.data;
}

export async function updateProduct({
	id,
	updateProductRequest,
}: {
	id: number;
	updateProductRequest: UpdateProductRequest;
}): Promise<UpdateProductResponse> {
	const res = await axiosInstance.put(
		apiEndpoints.products.update(id),
		updateProductRequest,
	);
	return res.data;
}

export async function deleteProduct(
	id: number,
): Promise<DeleteProductResponse> {
	const res = await axiosInstance.delete(apiEndpoints.products.delete(id));
	return res.data;
}
