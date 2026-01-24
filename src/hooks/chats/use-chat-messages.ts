import { ChatMessage, ChatUserRole, SendMessagePayload } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useSocketStore } from '@/store/socket-store';

type UseChatMessagesOptions = {
	receiverId: number;
	userRole: ChatUserRole;
};

export function useChatMessages({
	receiverId,
	userRole,
}: UseChatMessagesOptions) {
	const { socket, isConnected, userId } = useSocketStore();
	const queryClient = useQueryClient();
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	// Listen for incoming messages
	useEffect(() => {
		if (!socket) return;

		const handleReceiveMessage = (message: ChatMessage) => {
			console.log('[useChatMessages] Received message:', message);
			setMessages(prev => [...prev, message]);

			// Invalidate chat queries to refresh data
			queryClient.invalidateQueries({
				queryKey: ['chatHistory'],
			});
			queryClient.invalidateQueries({
				queryKey: ['pharmacistChats'],
			});
		};

		socket.on('receive_message', handleReceiveMessage);

		return () => {
			socket.off('receive_message', handleReceiveMessage);
		};
	}, [socket, queryClient]);

	// Send message function
	const sendMessage = useCallback(
		(message: string) => {
			if (!socket || !isConnected || !userId) {
				console.warn('[useChatMessages] Cannot send message: not connected');
				return;
			}

			const payload: SendMessagePayload = {
				senderId: userId,
				receiverId,
				senderRole: userRole,
				message,
			};

			// Send message via socket - backend will emit it back to us
			socket.emit('send_message', payload);
			console.log('[useChatMessages] Sent message:', payload);
		},
		[socket, isConnected, userId, receiverId, userRole],
	);

	// Clear messages (useful when switching conversations)
	const clearMessages = useCallback(() => {
		setMessages([]);
	}, []);

	return {
		isConnected,
		messages,
		sendMessage,
		clearMessages,
	};
}
