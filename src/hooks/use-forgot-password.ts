import { ForgotPasswordDto, ForgotPasswordResponse } from '@/lib/types'
import { handleAxiosError } from '@/lib/utils'
import { forgotPassword } from '@/services'
import { useAuthStore } from '@/store'
import { useMutation } from '@tanstack/react-query'

export function useForgotPassword() {
	const { setEmailPendingVerification } = useAuthStore()

	return useMutation({
		mutationFn: forgotPassword,
		onSuccess: (
			forgotPasswordResponse: ForgotPasswordResponse,
			forgotPasswordDto: ForgotPasswordDto,
		) => {
			setEmailPendingVerification(forgotPasswordDto.email)
		},
		onError: (error: any) => handleAxiosError(error),
	})
}
