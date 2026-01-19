import { getApprovedPrescription } from '@/services';
import {
	GetApprovedPrescriptionResponse,
	ApprovedPrescriptionFilterParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useApprovedPrescription(
	params?: ApprovedPrescriptionFilterParams,
	placeholderData?: GetApprovedPrescriptionResponse,
) {
	return useQuery({
		queryKey: ['prescriptions', 'approved', params],
		queryFn: () => getApprovedPrescription(params),
		staleTime: 1000 * 60 * 5,
		placeholderData,
	});
}
