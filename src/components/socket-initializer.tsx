'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/store/socket-store';

/**
 * Component that initializes the socket connection when user is authenticated
 * Should be placed at app root level
 */
export function SocketInitializer() {
	const { data: session } = useSession();
	const { connect, disconnect } = useSocketStore();

	const userId = session?.user?.id;

	useEffect(() => {
		if (userId) {
			connect(userId);
		} else {
			disconnect();
		}

		return () => {
			// Cleanup on unmount
			disconnect();
		};
	}, [userId, connect, disconnect]);

	return null;
}
