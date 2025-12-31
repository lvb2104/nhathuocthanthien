import { handleAxiosError } from '@/lib/utils';
import { createPrescription } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreatePrescription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPrescription,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
