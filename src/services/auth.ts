import { apiEndpoints } from '@/configs/apis'
import { axiosInstance } from '@/lib/axios'
import {
	forgotPasswordDto,
	resetPasswordDto,
	SignInDto,
	SignUpDto,
	verifyEmailDto,
	verifyResetPasswordOtpDto,
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

export const verifyEmail = async (verifyEmailDto: verifyEmailDto) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyEmail,
		verifyEmailDto,
	)
	return res.data
}

export const forgotPassword = async (forgotPasswordDto: forgotPasswordDto) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.forgotPassword,
		forgotPasswordDto,
	)
	return res.data
}

export const verifyResetPasswordOtp = async (
	verifyResetPasswordOtpDto: verifyResetPasswordOtpDto,
) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyResetPasswordOtp,
		verifyResetPasswordOtpDto,
	)
	return res.data
}

export const resetPassword = async (resetPasswordDto: resetPasswordDto) => {
	const res = await axiosInstance.post(
		apiEndpoints.auth.resetPassword,
		resetPasswordDto,
	)
	return res.data
}
