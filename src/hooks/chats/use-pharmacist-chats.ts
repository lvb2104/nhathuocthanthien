import { getChatsForPharmacist } from '@/services';
import { GetChatsForPharmacistResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function usePharmacistChats(
	placeholderData?: GetChatsForPharmacistResponse,
) {
	return useQuery({
		queryKey: ['pharmacistChats'],
		queryFn: () => getChatsForPharmacist(),
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
