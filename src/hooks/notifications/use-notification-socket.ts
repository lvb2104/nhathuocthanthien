import { useEffect, useState, useCallback } from 'react';
import { useSocketStore } from '@/store/socket-store';
import { useQueryClient } from '@tanstack/react-query';

export type SocketNotification = {
	message: string;
	sentAt: Date;
};

export function useNotificationSocket() {
	const socket = useSocketStore(state => state.socket);
	const queryClient = useQueryClient();
	const [notifications, setNotifications] = useState<SocketNotification[]>([]);

	useEffect(() => {
		if (!socket) return;

		const handleNotification = (data: { message: string; sentAt: Date }) => {
			setNotifications(prev => [...prev, data]);

			// Force refetch to update badge count immediately
			queryClient.refetchQueries({
				queryKey: ['notifications'],
			});
		};

		socket.on('notification', handleNotification);

		return () => {
			socket.off('notification', handleNotification);
		};
	}, [socket, queryClient]);

	const clearNotifications = useCallback(() => {
		setNotifications([]);
	}, []);

	return {
		notifications,
		clearNotifications,
	};
}
