'use client';
import { useAuthStore } from '@/store';
import RefreshTokenClient from './refresh-token-client';

function RefreshTokenClientWrapper() {
	const { isLoggedIn } = useAuthStore();

	if (!isLoggedIn) {
		// only render to refresh token if logged in
		return null;
	}

	return <RefreshTokenClient />;
}

export default RefreshTokenClientWrapper;
