// Dtos
export type SignInDto = {
	email: string;
	password: string;
};

export type SignUpDto = {
	email: string;
	password: string;
	fullName: string;
};

export type VerifyEmailDto = {
	email: string;
	otp: string;
};

export type ForgotPasswordDto = {
	email: string;
};

export type VerifyResetPasswordOtpDto = {
	email: string;
	otp: string;
};

export type ResetPasswordDto = {
	email: string;
	newPassword: string;
};

// Responses
export type SignInResponse = {
	accessToken: string;
};

export type RefreshTokenResponse = SignInResponse;

export type SignUpResponse = {
	message: string;
};

export type VerifyEmailResponse = SignUpResponse;

export type ForgotPasswordResponse = SignUpResponse;

export type VerifyResetPasswordOtpResponse = SignUpResponse;

export type ResetPasswordResponse = SignUpResponse;

// Models
export type JwtPayload = {
	id: number;
	fullName: string;
	avatarUrl: string;
	role: string;
	iat: number;
	exp: number;
};

export type User = {
	id: number;
	fullName: string;
	avatarUrl: string;
	role: string;
};
