import { handleAxiosError } from '@/lib/utils';
import { approvePrescription } from '@/services';
import { ApprovePrescriptionRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useApprovePrescription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: ApprovePrescriptionRequest;
		}) => approvePrescription(id, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
