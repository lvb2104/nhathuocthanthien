// contains app-wide configurations
export const app = {
	AXIOS_TIMEOUT: 10_000,
	RESEND_COOLDOWN_SECONDS: 60,
	REDIRECT_COOLDOWN_SECONDS: 5,
	REFRESH_THRESHOLD_MS: 60_000,
	localStorageKey: {
		ACCESS_TOKEN: 'access_token',
		AUTH_STORAGE: 'auth_storage',
		OTP_STORAGE: 'otp_cooldown_expires_at',
		USER_STORAGE: 'user_storage',
	},
};
