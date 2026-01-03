import { apiEndpoints } from '@/configs/apis';
import { getServerSessionWithAuth } from '@/lib/auth';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import {
	CreateBatchRequest,
	CreateBatchResponse,
	UpdateBatchRequest,
	UpdateBatchResponse,
	DisposeBatchRequest,
	DisposeBatchResponse,
	GetAllBatchesResponse,
	GetBatchByIdResponse,
	BatchFilterParams,
} from '@/types';

export async function createBatch(
	request: CreateBatchRequest,
): Promise<CreateBatchResponse> {
	const res = await axiosInstance.post(apiEndpoints.batches.create, request);
	return res.data;
}

export async function getAllBatches(
	params?: BatchFilterParams,
): Promise<GetAllBatchesResponse> {
	const res = await axiosInstance.get(apiEndpoints.batches.getAll, { params });
	return res.data;
}

export async function serverGetBatches(
	params?: BatchFilterParams,
): Promise<GetAllBatchesResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(apiEndpoints.batches.getAll, {
		params,
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
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
	const res = await axiosInstance.patch(
		apiEndpoints.batches.update(id),
		request,
	);
	return res.data;
}

export async function disposeBatch(
	id: number,
	request: DisposeBatchRequest,
): Promise<DisposeBatchResponse> {
	const res = await axiosInstance.put(
		apiEndpoints.batches.dispose(id),
		request,
	);
	return res.data;
}
