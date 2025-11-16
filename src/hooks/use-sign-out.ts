import { app } from '@/configs/app';
import { handleAxiosError } from '@/lib/utils';
import { signOut } from '@/services';
import { useAuthStore } from '@/store';
import { useMutation } from '@tanstack/react-query';

export function useSignOut() {
	const authStore = useAuthStore();

	return useMutation({
		mutationFn: signOut,
		onSuccess: async () => {
			authStore.setIsLoggedIn(false);
			authStore.setEmailPendingVerification(undefined);
			localStorage.removeItem(app.localStorageKey.ACCESS_TOKEN);
			localStorage.removeItem(app.localStorageKey.USER_STORAGE);
			localStorage.removeItem(app.localStorageKey.AUTH_STORAGE);
			localStorage.removeItem(app.localStorageKey.OTP_STORAGE);
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
