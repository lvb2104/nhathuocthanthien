import { getOnlinePharmacists } from '@/services';
import { useQuery } from '@tanstack/react-query';

export function useOnlinePharmacists() {
	return useQuery({
		queryKey: ['online-pharmacists'],
		queryFn: getOnlinePharmacists,
		staleTime: 1000 * 60, // 1 minute
		refetchInterval: 1000 * 30, // Refetch every 30 seconds to keep it fresh
	});
}
