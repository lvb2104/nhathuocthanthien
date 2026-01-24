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
	ProductFilterParams,
	MostSoldProductsFilterParams,
	GetMostSoldProductsResponse,
	SmartSearchParams,
	SmartSearchResponse,
} from '@/types';

export async function serverSmartSearch(
	params?: SmartSearchParams,
): Promise<SmartSearchResponse> {
	const res = await serverAxios.get(apiEndpoints.products.smartSearch, {
		params,
	});
	return res.data;
}

export async function smartSearch(
	params?: SmartSearchParams,
): Promise<SmartSearchResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.smartSearch, {
		params,
	});
	return res.data;
}

export async function serverGetMostSoldProducts(
	params?: MostSoldProductsFilterParams,
): Promise<GetMostSoldProductsResponse> {
	const res = await serverAxios.get(apiEndpoints.products.getMostSold, {
		params,
	});
	return res.data;
}

export async function getMostSoldProducts(
	params?: MostSoldProductsFilterParams,
): Promise<GetMostSoldProductsResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.getMostSold, {
		params,
	});
	return res.data;
}

export async function createProduct(
	request: CreateProductRequest,
): Promise<CreateProductResponse> {
	const res = await axiosInstance.post(apiEndpoints.products.create, request);
	return res.data;
}

export async function getProducts(
	params?: ProductFilterParams,
): Promise<GetProductsResponse> {
	const res = await axiosInstance.get(apiEndpoints.products.getAll, { params });
	return res.data;
}

export async function serverGetProducts(
	params?: ProductFilterParams,
): Promise<GetProductsResponse> {
	const res = await serverAxios.get(apiEndpoints.products.getAll, { params });
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

export async function updateProduct(
	id: number,
	request: UpdateProductRequest,
): Promise<UpdateProductResponse> {
	const res = await axiosInstance.put(
		apiEndpoints.products.update(id),
		request,
	);
	return res.data;
}

export async function deleteProduct(
	id: number,
): Promise<DeleteProductResponse> {
	const res = await axiosInstance.delete(apiEndpoints.products.delete(id));
	return res.data;
}
