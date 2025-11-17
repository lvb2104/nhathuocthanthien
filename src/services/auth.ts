import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import {
	ForgotPasswordRequest,
	ResetPasswordRequest,
	SignInRequest,
	SignUpRequest,
	VerifyEmailRequest,
	VerifyResetPasswordOtpRequest,
} from '@/types';

export async function signIn(signInRequest: SignInRequest) {
	const res = await axiosInstance.post(apiEndpoints.auth.signIn, signInRequest);
	return res.data;
}

export async function refreshToken() {
	const res = await axiosInstance.post(apiEndpoints.auth.refreshToken);
	return res.data;
}

export async function signUp(signUpRequest: SignUpRequest) {
	const res = await axiosInstance.post(apiEndpoints.auth.signUp, signUpRequest);
	return res.data;
}

export async function verifyEmail(verifyEmailRequest: VerifyEmailRequest) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyEmail,
		verifyEmailRequest,
	);
	return res.data;
}

export async function forgotPassword(
	forgotPasswordRequest: ForgotPasswordRequest,
) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.forgotPassword,
		forgotPasswordRequest,
	);
	return res.data;
}

export async function verifyResetPasswordOtp(
	verifyResetPasswordOtpRequest: VerifyResetPasswordOtpRequest,
) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyResetPasswordOtp,
		verifyResetPasswordOtpRequest,
	);
	return res.data;
}

export async function resetPassword(
	resetPasswordRequest: ResetPasswordRequest,
) {
	const res = await axiosInstance.post(
		apiEndpoints.auth.resetPassword,
		resetPasswordRequest,
	);
	return res.data;
}

export async function signOut() {
	const res = await axiosInstance.post(apiEndpoints.auth.signOut);
	return res.data;
}
