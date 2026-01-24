import { ChatMessage, ChatUserRole, SendMessagePayload } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type UseChatSocketOptions = {
	userId: number;
	receiverId: number;
	userRole: ChatUserRole;
	socketUrl?: string;
};

export function useChatSocket({
	userId,
	receiverId,
	userRole,
	socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ||
		'https://pharmacy-retail.onrender.com',
}: UseChatSocketOptions) {
	const socketRef = useRef<Socket | null>(null);
	const queryClient = useQueryClient();
	const [isConnected, setIsConnected] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	// Connect to socket
	useEffect(() => {
		if (!userId || !socketUrl) return;

		console.log('Connecting to socket URL:', socketUrl);

		socketRef.current = io(socketUrl, {
			transports: ['websocket'],
		});

		const socket = socketRef.current;

		socket.on('connect', () => {
			console.log('Socket connected:', socket.id);
			setIsConnected(true);
			// Join user's room
			socket.emit('join_room', `user_${userId}`);
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		socket.on('receive_message', (message: ChatMessage) => {
			setMessages(prev => [...prev, message]);
			// Invalidate chat history query to refresh data
			queryClient.invalidateQueries({
				queryKey: ['chatHistory'],
			});
			queryClient.invalidateQueries({
				queryKey: ['pharmacistChats'],
			});
		});

		socket.on('error', (errorMessage: string) => {
			console.error('Socket error:', errorMessage);
		});

		return () => {
			socket.disconnect();
		};
	}, [userId, socketUrl, queryClient]);

	// Send message function
	const sendMessage = useCallback(
		(message: string) => {
			if (!socketRef.current || !isConnected) return;

			const payload: SendMessagePayload = {
				senderId: userId,
				receiverId,
				senderRole: userRole,
				message,
			};

			// Optimistically add the message to local state
			const optimisticMessage: ChatMessage = {
				id: Date.now(), // Temporary ID
				customerId: userRole === ChatUserRole.CUSTOMER ? userId : receiverId,
				pharmacistId:
					userRole === ChatUserRole.PHARMACIST ? userId : receiverId,
				message,
				sentAt: new Date().toISOString(),
			};

			setMessages(prev => [...prev, optimisticMessage]);
			socketRef.current.emit('send_message', payload);
		},
		[userId, receiverId, userRole, isConnected],
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
