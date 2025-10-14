import { SignInResponse } from '@/lib/types'
import { handleAxiosError } from '@/lib/utils'
import { signIn } from '@/services'
import { useAuthStore } from '@/store'
import { useMutation } from '@tanstack/react-query'

export function useSignIn() {
	const { setIsLoggedIn } = useAuthStore()

	return useMutation({
		mutationFn: signIn,
		onSuccess: (signInResponse: SignInResponse) => {
			setIsLoggedIn(true, signInResponse.accessToken)
		},
		onError: (error: any) => handleAxiosError(error),
	})
}
