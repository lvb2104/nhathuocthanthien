'use client';
import { app } from '@/configs/app';
import { useRefreshToken } from '@/hooks/use-refresh-token';
import { RefreshTokenResponse } from '@/lib/types';
import { getExpFromJwtToken } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

function RefreshTokenClient() {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const { mutate } = useRefreshToken();
	const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isFetchingRef = useRef<boolean>(false);

	useEffect(() => {
		const accessTokenLocal = localStorage.getItem(
			app.localStorageKey.ACCESS_TOKEN,
		);
		setAccessToken(accessTokenLocal);
	}, []);

	const scheduleTokenRefresh = useCallback(
		(token: string) => {
			const exp = getExpFromJwtToken(token);
			const delay = exp * 1000 - Date.now() - app.REFRESH_THRESHOLD_MS; // Refresh 1 minute before expiration
			// const delay = 10_000; // For testing, refresh every 10 seconds

			if (delay <= 0) {
				return; // Token already expired or about to expire
			}

			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current); // Clear any existing timeout
			}

			refreshTimeoutRef.current = setTimeout(() => {
				if (isFetchingRef.current) return;

				isFetchingRef.current = true;
				mutate(undefined, {
					onSuccess: (refreshTokenResponse: RefreshTokenResponse) => {
						const newToken = refreshTokenResponse.accessToken;
						localStorage.setItem(app.localStorageKey.ACCESS_TOKEN, newToken);
						setAccessToken(newToken);
						isFetchingRef.current = false;
						scheduleTokenRefresh(newToken); // Schedule next refresh
					},
					onError: () => {
						isFetchingRef.current = false;
					},
				});
			}, delay);
		},
		[mutate],
	);

	useEffect(() => {
		if (!accessToken) return;
		scheduleTokenRefresh(accessToken);
		return () => {
			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current);
			}
		};
	}, [accessToken, scheduleTokenRefresh]);

	return null;
}

export default RefreshTokenClient;
