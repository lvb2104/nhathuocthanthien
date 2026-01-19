import { getMyPrescriptions } from '@/services';
import {
	GetMyPrescriptionsResponse,
	MyPrescriptionsFilterParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useMyPrescriptions(
	params?: MyPrescriptionsFilterParams,
	placeholderData?: GetMyPrescriptionsResponse,
) {
	return useQuery({
		queryKey: ['prescriptions', 'my', params],
		queryFn: () => getMyPrescriptions(params),
		staleTime: 1000 * 60 * 5,
		placeholderData,
	});
}
