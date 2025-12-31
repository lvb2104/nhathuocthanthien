import { getAllPrescriptionsForPharmacist } from '@/services';
import { GetAllPrescriptionsForPharmacistResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function usePharmacistPrescriptions(
	initialData?: GetAllPrescriptionsForPharmacistResponse,
) {
	return useQuery({
		queryKey: ['prescriptions', 'pharmacist'],
		queryFn: () => getAllPrescriptionsForPharmacist(),
		staleTime: 1000 * 60 * 5,
		initialData,
	});
}
