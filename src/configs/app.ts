// contains app-wide configurations
export const app = {
	AXIOS_TIMEOUT: 60000,
	RESEND_COOLDOWN_SECONDS: 60,
	REDIRECT_COOLDOWN_SECONDS: 5,
	REFRESH_THRESHOLD_MS: 60000,
	localStorageKey: {
		AUTH_STORAGE: 'auth_storage',
		OTP_STORAGE: 'otp_cooldown_expires_at',
	},
	DEFAULT_IMAGE_URL:
		'https://ih1.redbubble.net/image.783694930.9447/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.u3.webp',
	CREDENTIALS_PROVIDER_ID: 'credentials',
};
