import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	CreateBatchRequest,
	CreateBatchResponse,
	UpdateBatchRequest,
	UpdateBatchResponse,
	DisposeBatchRequest,
	DisposeBatchResponse,
	GetAllBatchesResponse,
	GetBatchByIdResponse,
	DeleteBatchResponse,
} from '@/types';

export async function createBatch(
	request: CreateBatchRequest,
): Promise<CreateBatchResponse> {
	const res = await axiosInstance.post(apiEndpoints.batches.create, request);
	return res.data;
}

export async function getAllBatches(params?: {
	page?: number;
	limit?: number;
	productId?: number;
	status?: string;
	expired?: boolean;
	keyword?: string;
}): Promise<GetAllBatchesResponse> {
	const res = await axiosInstance.get(apiEndpoints.batches.getAll, { params });
	return res.data;
}

export async function getBatchById(id: number): Promise<GetBatchByIdResponse> {
	const res = await axiosInstance.get(apiEndpoints.batches.getById(id));
	return res.data;
}

export async function updateBatch(
	id: number,
	request: UpdateBatchRequest,
): Promise<UpdateBatchResponse> {
	const res = await axiosInstance.put(apiEndpoints.batches.update(id), request);
	return res.data;
}

export async function disposeBatch(
	id: number,
	request: DisposeBatchRequest,
): Promise<DisposeBatchResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.batches.dispose(id),
		request,
	);
	return res.data;
}

export async function deleteBatch(id: number): Promise<DeleteBatchResponse> {
	const res = await axiosInstance.delete(apiEndpoints.batches.delete(id));
	return res.data;
}
