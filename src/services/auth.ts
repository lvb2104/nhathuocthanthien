import { apiEndpoints } from '@/configs/apis';
import { axiosInstance } from '@/lib/axios';
import { serverAxios } from '@/lib/server-axios';
import {
	ForgotPasswordRequest,
	ForgotPasswordResponse,
	RefreshTokenResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	SignInRequest,
	SignInResponse,
	SignOutResponse,
	SignUpRequest,
	SignUpResponse,
	VerifyEmailRequest,
	VerifyEmailResponse,
	VerifyResetPasswordOtpRequest,
	VerifyResetPasswordOtpResponse,
} from '@/types';

export async function signIn(
	signInRequest: SignInRequest,
): Promise<SignInResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.signIn, signInRequest);
	return res.data;
}

export async function serverSignIn(
	signInRequest: SignInRequest,
): Promise<SignInResponse> {
	const res = await serverAxios.post<SignInResponse>(
		apiEndpoints.auth.signIn,
		signInRequest,
	);
	return res.data;
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.refreshToken);
	return res.data;
}

export async function serverRefreshToken(): Promise<RefreshTokenResponse> {
	const res = await serverAxios.post<RefreshTokenResponse>(
		apiEndpoints.auth.refreshToken,
	);
	return res.data;
}

export async function signUp(
	signUpRequest: SignUpRequest,
): Promise<SignUpResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.signUp, signUpRequest);
	return res.data;
}

export async function verifyEmail(
	verifyEmailRequest: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyEmail,
		verifyEmailRequest,
	);
	return res.data;
}

export async function forgotPassword(
	forgotPasswordRequest: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.auth.forgotPassword,
		forgotPasswordRequest,
	);
	return res.data;
}

export async function verifyResetPasswordOtp(
	verifyResetPasswordOtpRequest: VerifyResetPasswordOtpRequest,
): Promise<VerifyResetPasswordOtpResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyResetPasswordOtp,
		verifyResetPasswordOtpRequest,
	);
	return res.data;
}

export async function resetPassword(
	resetPasswordRequest: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.auth.resetPassword,
		resetPasswordRequest,
	);
	return res.data;
}

export async function signOut(): Promise<SignOutResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.signOut);
	return res.data;
}
