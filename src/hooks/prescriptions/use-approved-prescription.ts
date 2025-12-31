import { getApprovedPrescription } from '@/services';
import { GetApprovedPrescriptionResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useApprovedPrescription(
	initialData?: GetApprovedPrescriptionResponse,
) {
	return useQuery({
		queryKey: ['prescriptions', 'approved'],
		queryFn: () => getApprovedPrescription(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
