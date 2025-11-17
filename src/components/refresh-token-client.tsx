'use client';
import { app } from '@/configs/app';
import { useRefreshToken } from '@/hooks';
import { getDecodedPayloadFromJwt } from '@/lib/utils';
import { RefreshTokenResponse } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

function RefreshTokenClient() {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const { mutateAsync } = useRefreshToken();
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
			const { exp } = getDecodedPayloadFromJwt(token);
			const delay = exp * 1000 - Date.now() - app.REFRESH_THRESHOLD_MS; // Refresh before expiration based on configured threshold

			if (delay <= 0) {
				return; // Token already expired or about to expire
			}

			if (refreshTimeoutRef.current) {
				clearTimeout(refreshTimeoutRef.current); // Clear any existing timeout
			}

			refreshTimeoutRef.current = setTimeout(() => {
				if (isFetchingRef.current) return;

				isFetchingRef.current = true;
				mutateAsync()
					.then((refreshTokenResponse: RefreshTokenResponse) => {
						const newToken = refreshTokenResponse.accessToken;
						localStorage.setItem(app.localStorageKey.ACCESS_TOKEN, newToken);
						setAccessToken(newToken);
						isFetchingRef.current = false;
						scheduleTokenRefresh(newToken); // Schedule next refresh
					})
					.catch(() => {
						isFetchingRef.current = false;
					});
			}, delay);
		},
		[mutateAsync],
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
