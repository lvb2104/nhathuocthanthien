import { getMyPrescriptionById } from '@/services';
import { GetMyPrescriptionByIdResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useMyPrescription(
	id: number,
	initialData?: GetMyPrescriptionByIdResponse,
) {
	return useQuery({
		queryKey: ['prescriptions', 'my', id],
		queryFn: () => getMyPrescriptionById(id),
		staleTime: 1000 * 60 * 5,
		initialData,
		enabled: !!id,
	});
}
