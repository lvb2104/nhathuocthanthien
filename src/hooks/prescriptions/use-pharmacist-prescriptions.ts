import { getAllPrescriptionsForPharmacist } from '@/services';
import {
	GetAllPrescriptionsForPharmacistResponse,
	PharmacistPrescriptionsFilterParams,
} from '@/types';
import { useQuery } from '@tanstack/react-query';

export function usePharmacistPrescriptions(
	params?: PharmacistPrescriptionsFilterParams,
	placeholderData?: GetAllPrescriptionsForPharmacistResponse,
) {
	return useQuery({
		queryKey: ['prescriptions', 'pharmacist', params],
		queryFn: () => getAllPrescriptionsForPharmacist(params),
		staleTime: 1000 * 60 * 5,
		placeholderData,
	});
}
