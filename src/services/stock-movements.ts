import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	GetAllStockMovementsResponse,
	GetStockMovementsByProductResponse,
	StockMovementFilterParams,
	StockMovementByProductParams,
} from '@/types';

export async function getAllStockMovements(
	params?: StockMovementFilterParams,
): Promise<GetAllStockMovementsResponse> {
	const res = await axiosInstance.get(apiEndpoints.stockMovements.getAll, {
		params,
	});
	return res.data;
}

export async function getStockMovementsByProduct(
	productId: number,
	params?: StockMovementByProductParams,
): Promise<GetStockMovementsByProductResponse> {
	const res = await axiosInstance.get(
		apiEndpoints.stockMovements.getByProduct(productId),
		{ params },
	);
	return res.data;
}
