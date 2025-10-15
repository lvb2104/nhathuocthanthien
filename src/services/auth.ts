import { apiEndpoints } from '@/configs/apis'
import { axiosInstance } from '@/lib/axios'
import {
	ForgotPasswordDto,
	ResetPasswordDto,
	SignInDto,
	SignUpDto,
	VerifyEmailDto,
	VerifyResetPasswordOtpDto,
} from '@/lib/types'

export const signIn = async (signInDto: SignInDto) => {
	const res = await axiosInstance.post(apiEndpoints.auth.signIn, signInDto)
	return res.data
}

export const refreshToken = async () => {
	const res = await axiosInstance.post(apiEndpoints.auth.refreshToken)
	return res.data
}

export const signUp = async (signUp: SignUpDto) => {
	const res = await axiosInstance.post(apiEndpoints.auth.signUp, signUp)
	return res.data
}

export const verifyEmail = async (verifyEmailDto: VerifyEmailDto) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyEmail,
		verifyEmailDto,
	)
	return res.data
}

export const forgotPassword = async (forgotPasswordDto: ForgotPasswordDto) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.forgotPassword,
		forgotPasswordDto,
	)
	return res.data
}

export const verifyResetPasswordOtp = async (
	verifyResetPasswordOtpDto: VerifyResetPasswordOtpDto,
) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyResetPasswordOtp,
		verifyResetPasswordOtpDto,
	)
	return res.data
}

export const resetPassword = async (resetPasswordDto: ResetPasswordDto) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.resetPassword,
		resetPasswordDto,
	)
	return res.data
}
