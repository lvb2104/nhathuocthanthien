import { getChatHistory } from '@/services';
import { GetChatHistoryParams, GetChatHistoryResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useChatHistory(
	params: GetChatHistoryParams,
	placeholderData?: GetChatHistoryResponse,
) {
	return useQuery({
		queryKey: ['chatHistory', params.pharmacistId],
		queryFn: () => getChatHistory(params),
		enabled: !!params.pharmacistId,
		staleTime: 1000 * 60 * 5, // 5 minutes
		placeholderData,
	});
}
