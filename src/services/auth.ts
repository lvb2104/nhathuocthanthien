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
	request: SignInRequest,
): Promise<SignInResponse> {
	const res = await serverAxios.post<SignInResponse>(
		apiEndpoints.auth.signIn,
		request,
	);
	return res.data;
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.refreshToken);
	return res.data;
}

export async function serverRefreshToken(
	cookieHeader?: string,
): Promise<RefreshTokenResponse> {
	const res = await serverAxios.post<RefreshTokenResponse>(
		apiEndpoints.auth.refreshToken,
		undefined,
		{
			headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
		},
	);
	return res.data;
}

export async function signUp(request: SignUpRequest): Promise<SignUpResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.signUp, request);
	return res.data;
}

export async function verifyEmail(
	request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.verifyEmail, request);
	return res.data;
}

export async function forgotPassword(
	request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.auth.forgotPassword,
		request,
	);
	return res.data;
}

export async function verifyResetPasswordOtp(
	request: VerifyResetPasswordOtpRequest,
): Promise<VerifyResetPasswordOtpResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.auth.verifyResetPasswordOtp,
		request,
	);
	return res.data;
}

export async function resetPassword(
	request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
	const res = await axiosInstance.post(
		apiEndpoints.auth.resetPassword,
		request,
	);
	return res.data;
}

export async function signOut(): Promise<SignOutResponse> {
	const res = await axiosInstance.post(apiEndpoints.auth.signOut);
	return res.data;
}
