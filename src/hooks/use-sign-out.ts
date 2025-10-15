import { handleAxiosError } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { useMutation } from '@tanstack/react-query'

export function useSignOut() {
	const authStore = useAuthStore()

	return useMutation({
		mutationFn: async () => {
			authStore.setIsLoggedIn(false)
			authStore.setEmailPendingVerification(undefined)
			localStorage.removeItem('access-token')
			return
		},
		onSuccess: () => {},
		onError: (error: any) => handleAxiosError(error),
	})
}
