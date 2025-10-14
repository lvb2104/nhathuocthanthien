// Dtos
export type SignInDto = {
	email: string
	password: string
}

export type SignUpDto = {
	email: string
	password: string
	fullName: string
}

export type verifyEmailDto = {
	email: string
	otp: string
}

export type forgotPasswordDto = {
	email: string
}

export type verifyResetPasswordOtpDto = {
	email: string
	otp: string
}

export type resetPasswordDto = {
	email: string
	newPassword: string
}

// Responses
export type SignInResponse = {
	accessToken: string
}

export type RefreshTokenResponse = SignInResponse

export type SignUpResponse = {
	message: string
}

export type verifyEmailResponse = SignUpResponse

export type forgotPasswordResponse = SignUpResponse

export type verifyResetPasswordOtpResponse = SignUpResponse

export type resetPasswordResponse = SignUpResponse

// Models
