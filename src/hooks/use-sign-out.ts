import { app } from '@/configs/app';
import { handleAxiosError } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { useMutation } from '@tanstack/react-query';

export function useSignOut() {
	const authStore = useAuthStore();

	return useMutation({
		mutationFn: async () => {
			authStore.setIsLoggedIn(false);
			authStore.setEmailPendingVerification(undefined);
			localStorage.removeItem(app.localStorageKey.ACCESS_TOKEN);
			localStorage.removeItem(app.localStorageKey.USER_STORAGE);
			localStorage.removeItem(app.localStorageKey.AUTH_STORAGE);
			localStorage.removeItem(app.localStorageKey.OTP_STORAGE);
			return;
		},
		onSuccess: () => {},
		onError: (error: any) => handleAxiosError(error),
	});
}
