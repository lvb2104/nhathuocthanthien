import { getMyPrescriptions } from '@/services';
import { GetMyPrescriptionsResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useMyPrescriptions(initialData?: GetMyPrescriptionsResponse) {
	return useQuery({
		queryKey: ['prescriptions', 'my'],
		queryFn: () => getMyPrescriptions(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
