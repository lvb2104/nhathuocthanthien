import { handleAxiosError } from '@/lib/utils';
import { updateCategory } from '@/services';
import { UpdateCategoryRequest } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			request,
		}: {
			id: number;
			request: UpdateCategoryRequest;
		}) => updateCategory(id, request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
