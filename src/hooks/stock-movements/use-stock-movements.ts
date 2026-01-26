import { getAllStockMovements } from '@/services';
import {
	GetAllStockMovementsResponse,
	StockMovementFilterParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useStockMovements(
	params?: StockMovementFilterParams,
	placeholderData?: GetAllStockMovementsResponse,
) {
	return useQuery({
		queryKey: ['stock-movements', params],
		queryFn: () => getAllStockMovements(params),
		staleTime: 1000 * 60 * 5,
		placeholderData,
	});
}
