import { getStockMovementsByProduct } from '@/services';
import {
	GetStockMovementsByProductResponse,
	StockMovementByProductParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useStockMovementsByProduct(
	productId: number,
	params?: StockMovementByProductParams,
	placeholderData?: GetStockMovementsByProductResponse,
) {
	return useQuery({
		queryKey: ['stock-movements', 'product', productId, params],
		queryFn: () => getStockMovementsByProduct(productId, params),
		staleTime: 1000 * 60 * 5,
		placeholderData,
		enabled: !!productId,
	});
}
