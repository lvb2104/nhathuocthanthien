import { UserRole } from '.';

// ============================================================================
// SIGN IN
// ============================================================================
export type SignInRequest = {
	email: string;
	password: string;
};

export type SignInResponse = {
	accessToken: string;
};

// ============================================================================
// SIGN UP
// ============================================================================
export type SignUpRequest = {
	email: string;
	fullName: string;
	password: string;
};

export type SignUpResponse = {
	message: string;
};

// ============================================================================
// VERIFY EMAIL
// ============================================================================
export type VerifyEmailRequest = {
	email: string;
	otp: string;
};

export type VerifyEmailResponse = {
	message: string;
};

// ============================================================================
// FORGOT PASSWORD
// ============================================================================
export type ForgotPasswordRequest = {
	email: string;
};

export type ForgotPasswordResponse = {
	message: string;
};

// ============================================================================
// VERIFY RESET PASSWORD OTP
// ============================================================================
export type VerifyResetPasswordOtpRequest = {
	email: string;
	otp: string;
};

export type VerifyResetPasswordOtpResponse = {
	message: string;
};

// ============================================================================
// RESET PASSWORD
// ============================================================================
export type ResetPasswordRequest = {
	email: string;
	newPassword: string;
};

export type ResetPasswordResponse = {
	message: string;
};

// ============================================================================
// REFRESH TOKEN
// ============================================================================
export type RefreshTokenResponse = {
	accessToken: string;
};

// ============================================================================
// SIGN OUT
// ============================================================================
export type SignOutResponse = {
	message: string;
};

// ============================================================================
// MODELS
// ============================================================================
export type JwtPayload = {
	id: number;
	fullName: string;
	avatarUrl: string;
	role: UserRole;
	iat: number;
	exp: number;
};

export type User = {
	id: number;
	email: string;
	fullName: string;
	avatarUrl: string;
	role: UserRole;
};
