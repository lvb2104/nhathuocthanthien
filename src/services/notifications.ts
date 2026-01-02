import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	GetNotificationsResponse,
	MarkAsReadResponse,
	MarkAllAsReadResponse,
} from '@/types';

export async function getNotifications(): Promise<GetNotificationsResponse> {
	const res = await axiosInstance.get(apiEndpoints.notifications.getAll);
	return res.data;
}

export async function markNotificationAsRead(
	id: number,
): Promise<MarkAsReadResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.notifications.markAsRead(id),
	);
	return res.data;
}

export async function markAllNotificationsAsRead(): Promise<MarkAllAsReadResponse> {
	const res = await axiosInstance.patch(
		apiEndpoints.notifications.markAllAsRead,
	);
	return res.data;
}
