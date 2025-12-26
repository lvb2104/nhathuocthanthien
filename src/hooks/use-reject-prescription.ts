import { handleAxiosError } from '@/lib/utils';
import { rejectPrescription } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRejectPrescription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rejectPrescription,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
