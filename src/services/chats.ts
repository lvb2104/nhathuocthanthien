import { apiEndpoints } from '@/configs/apis';
import { getServerSessionWithAuth } from '@/lib/auth';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import {
	GetChatHistoryParams,
	GetChatHistoryResponse,
	GetChatsForPharmacistResponse,
} from '@/types';

/**
 * Get chat history between the current user and a specific pharmacist
 */
export async function getChatHistory(
	params: GetChatHistoryParams,
): Promise<GetChatHistoryResponse> {
	const res = await axiosInstance.get(apiEndpoints.chats.getHistory, {
		params,
	});
	return res.data;
}

/**
 * Get all chats for the logged-in pharmacist
 */
export async function getChatsForPharmacist(): Promise<GetChatsForPharmacistResponse> {
	const res = await axiosInstance.get(apiEndpoints.chats.getPharmacistChats);
	return res.data;
}

// ============================================================================
// SERVER-SIDE FUNCTIONS
// ============================================================================

/**
 * Server-side function for Next.js server components - Get chat history
 */
export async function serverGetChatHistory(
	params: GetChatHistoryParams,
): Promise<GetChatHistoryResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(apiEndpoints.chats.getHistory, {
		params,
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
	return res.data;
}

/**
 * Server-side function for Next.js server components - Get pharmacist chats
 */
export async function serverGetChatsForPharmacist(): Promise<GetChatsForPharmacistResponse> {
	const session = await getServerSessionWithAuth();
	if (!session?.accessToken) {
		throw new Error('Unauthorized: No access token in session');
	}
	const res = await serverAxios.get(apiEndpoints.chats.getPharmacistChats, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
	return res.data;
}
