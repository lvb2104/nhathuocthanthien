import { handleAxiosError } from '@/lib/utils';
import { createCategory } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
