import { SignUpDto, SignUpResponse } from '@/lib/types'
import { handleAxiosError } from '@/lib/utils'
import { signUp } from '@/services'
import { useAuthStore } from '@/store'
import { useMutation } from '@tanstack/react-query'

export function useSignUp() {
	const { setEmailPendingVerification } = useAuthStore()

	return useMutation({
		mutationFn: signUp,
		onSuccess: (signUpResponse: SignUpResponse, signUpDto: SignUpDto) => {
			setEmailPendingVerification(signUpDto.email) // Set email to be verified
		},
		onError: (error: any) => handleAxiosError(error),
	})
}
