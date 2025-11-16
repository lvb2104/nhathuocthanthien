import { app } from '@/configs/app';
import { getDecodedPayloadFromJwt, handleAxiosError } from '@/lib/utils';
import { signIn } from '@/services';
import { useAuthStore, useUserStore } from '@/store';
import { SignInRequest, SignInResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useSignIn() {
	const { setIsLoggedIn } = useAuthStore();
	const { setUser } = useUserStore();

	return useMutation({
		mutationFn: signIn,
		onSuccess: (
			signInResponse: SignInResponse,
			signInRequest: SignInRequest,
		) => {
			localStorage.setItem(
				app.localStorageKey.ACCESS_TOKEN,
				signInResponse.accessToken,
			);
			const { id, fullName, avatarUrl, role } = getDecodedPayloadFromJwt(
				signInResponse.accessToken,
			);
			setUser({ id, fullName, avatarUrl, role, email: signInRequest.email });
			setIsLoggedIn(true); // Update auth state on successful sign-in
		},
		onError: (error: any) => handleAxiosError(error),
	});
}
