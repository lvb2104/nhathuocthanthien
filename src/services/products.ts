import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	CreateProductRequest,
	CreateProductResponse,
	DeleteProductResponse,
	GetProductByIdResponse,
	GetProductsResponse,
	UpdateProductRequest,
	UpdateProductResponse,
} from '@/types';

export async function CreateProduct(
	createProductRequest: CreateProductRequest,
): Promise<CreateProductResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.products.create,
		createProductRequest,
	);
	return res.data;
}

export async function GetProducts(): Promise<GetProductsResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.getAll);
	return res.data;
}

export async function GetProductById(
	id: number,
): Promise<GetProductByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.getById(id));
	return res.data;
}

export async function UpdateProduct({
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

export async function DeleteProduct(
	id: number,
): Promise<DeleteProductResponse> {
	const res = await axiosInstance.delete(apiEndpoints.products.delete(id));
	return res.data;
}
