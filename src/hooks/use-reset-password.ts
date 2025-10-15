import { handleAxiosError } from '@/lib/utils'
import { resetPassword } from '@/services'
import { useAuthStore } from '@/store'
import { useMutation } from '@tanstack/react-query'

export function useResetPassword() {
	const { setEmailPendingVerification } = useAuthStore()
	return useMutation({
		mutationFn: resetPassword,
		onSuccess: () => {
			setEmailPendingVerification(undefined)
		},
		onError: (error: any) => handleAxiosError(error),
	})
}
