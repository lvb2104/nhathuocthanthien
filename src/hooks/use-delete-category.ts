import { handleAxiosError } from '@/lib/utils';
import { deleteCategory } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
