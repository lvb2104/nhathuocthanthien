import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

type SocketState = {
	socket: Socket | null;
	isConnected: boolean;
	userId: number | null;
	connect: (userId: number) => void;
	disconnect: () => void;
};

const socketUrl =
	process.env.NEXT_PUBLIC_SOCKET_URL || 'https://pharmacy-retail.onrender.com';

export const useSocketStore = create<SocketState>((set, get) => ({
	socket: null,
	isConnected: false,
	userId: null,

	connect: (userId: number) => {
		const currentSocket = get().socket;

		// Prevent duplicate connections
		if (currentSocket?.connected && get().userId === userId) {
			console.log('[SocketStore] Already connected, skipping...');
			return;
		}

		// Disconnect existing socket if any
		if (currentSocket) {
			console.log('[SocketStore] Disconnecting existing socket');
			currentSocket.disconnect();
		}

		console.log('[SocketStore] Connecting to:', socketUrl);

		// Create new socket connection
		const socket = io(socketUrl, {
			transports: ['websocket'],
		});

		socket.on('connect', () => {
			console.log('[SocketStore] Connected:', socket.id);
			set({ isConnected: true });

			// Auto-join user's room for receiving notifications and chat
			socket.emit('join', userId);
			console.log(`[SocketStore] Joined room: user_${userId}`);
		});

		socket.on('disconnect', () => {
			console.log('[SocketStore] Disconnected');
			set({ isConnected: false });
		});

		socket.on('error', (error: string) => {
			console.error('[SocketStore] Error:', error);
		});

		set({ socket, userId });
	},

	disconnect: () => {
		const { socket } = get();
		if (socket) {
			console.log('[SocketStore] Cleaning up socket connection');
			socket.disconnect();
			set({ socket: null, isConnected: false, userId: null });
		}
	},
}));
