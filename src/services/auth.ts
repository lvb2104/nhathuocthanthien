import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	ForgotPasswordDto,
	ResetPasswordDto,
	SignInDto,
	SignUpDto,
	VerifyEmailDto,
	VerifyResetPasswordOtpDto,
} from '@/lib/types';

export async function signIn(signInDto: SignInDto) {
	const res = await axiosInstance.post(apiEndpoints.auth.signIn, signInDto);
	return res.data;
}

export async function refreshToken() {
	const res = await axiosInstance.post(apiEndpoints.auth.refreshToken);
	return res.data;
}

export async function signUp(signUp: SignUpDto) {
	const res = await axiosInstance.post(apiEndpoints.auth.signUp, signUp);
	return res.data;
}

export async function verifyEmail(verifyEmailDto: VerifyEmailDto) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyEmail,
		verifyEmailDto,
	);
	return res.data;
}

export async function forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.forgotPassword,
		forgotPasswordDto,
	);
	return res.data;
}

export async function verifyResetPasswordOtp(
	verifyResetPasswordOtpDto: VerifyResetPasswordOtpDto,
) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyResetPasswordOtp,
		verifyResetPasswordOtpDto,
	);
	return res.data;
}

export async function resetPassword(resetPasswordDto: ResetPasswordDto) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.resetPassword,
		resetPasswordDto,
	);
	return res.data;
}
