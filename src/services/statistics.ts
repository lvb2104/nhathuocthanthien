import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	GetOverviewStatisticsResponse,
	GetRevenueStatisticsResponse,
	RevenueStatisticsParams,
	GetTopSellingProductsResponse,
	TopSellingProductsParams,
	GetInventoryStatisticsResponse,
	ExportRevenueParams,
	ExportProductsParams,
	ExportInventoryParams,
} from '@/types';

export async function getOverviewStatistics(): Promise<GetOverviewStatisticsResponse> {
	const res = await axiosInstance.get(apiEndpoints.statistics.getOverview);
	return res.data;
}

export async function getRevenueStatistics(
	params?: RevenueStatisticsParams,
): Promise<GetRevenueStatisticsResponse> {
	const res = await axiosInstance.get(apiEndpoints.statistics.getRevenue, {
		params,
	});
	return res.data;
}

export async function getTopSellingProducts(
	params?: TopSellingProductsParams,
): Promise<GetTopSellingProductsResponse> {
	const res = await axiosInstance.get(apiEndpoints.statistics.getTopProducts, {
		params,
	});
	return res.data;
}

export async function getInventoryStatistics(): Promise<GetInventoryStatisticsResponse> {
	const res = await axiosInstance.get(apiEndpoints.statistics.getInventory);
	return res.data;
}

export async function exportRevenueReport(
	params?: ExportRevenueParams,
): Promise<Blob> {
	const res = await axiosInstance.get(apiEndpoints.statistics.exportRevenue, {
		params,
		responseType: 'blob',
	});
	return res.data;
}

export async function exportProductsReport(
	params?: ExportProductsParams,
): Promise<Blob> {
	const res = await axiosInstance.get(apiEndpoints.statistics.exportProducts, {
		params,
		responseType: 'blob',
	});
	return res.data;
}

export async function exportInventoryReport(
	params?: ExportInventoryParams,
): Promise<Blob> {
	const res = await axiosInstance.get(apiEndpoints.statistics.exportInventory, {
		params,
		responseType: 'blob',
	});
	return res.data;
}
