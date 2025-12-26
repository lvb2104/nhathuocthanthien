// Sign In
export type SignInRequest = {
	email: string;
	password: string;
};

export type SignInResponse = {
	accessToken: string;
};

// Sign Up
export type SignUpRequest = {
	email: string;
	fullName: string;
	password: string;
};

export type SignUpResponse = {
	message: string;
};

// Verify Email
export type VerifyEmailRequest = {
	email: string;
	otp: string;
};

export type VerifyEmailResponse = {
	message: string;
};

// Forgot Password
export type ForgotPasswordRequest = {
	email: string;
};

export type ForgotPasswordResponse = {
	message: string;
};

// Verify Reset Password OTP
export type VerifyResetPasswordOtpRequest = {
	email: string;
	otp: string;
};

export type VerifyResetPasswordOtpResponse = {
	message: string;
};

// Reset Password
export type ResetPasswordRequest = {
	email: string;
	newPassword: string;
};

export type ResetPasswordResponse = {
	message: string;
};

// Refresh Token
export type RefreshTokenResponse = {
	accessToken: string;
};

// Sign Out
export type SignOutResponse = {
	message: string;
};

// Models
export type JwtPayload = {
	id: number;
	fullName: string;
	avatarUrl: string;
	role: UserRole;
	iat: number;
	exp: number;
};

enum UserRole {
	CUSTOMER = 'customer',
	ADMIN = 'admin',
	PHARMACIST = 'pharmacist',
}

export type User = {
	id: number;
	email: string;
	fullName: string;
	avatarUrl: string;
	role: UserRole;
};
