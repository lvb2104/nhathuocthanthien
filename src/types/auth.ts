import z from 'zod';
import {
	SignInFormSchema,
	VerifyEmailFormSchema,
	ForgotPasswordFormSchema,
	VerifyResetPasswordOtpFormSchema,
	SignUpRequestSchema,
	ResetPasswordRequestSchema,
} from '@/schemas/auth';

// Requests
export type SignInRequest = z.infer<typeof SignInFormSchema>;

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

export type VerifyEmailRequest = z.infer<typeof VerifyEmailFormSchema>;

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordFormSchema>;

export type VerifyResetPasswordOtpRequest = z.infer<
	typeof VerifyResetPasswordOtpFormSchema
>;

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

// Responses
export type SignInResponse = {
	accessToken: string;
};

export type RefreshTokenResponse = {
	accessToken: string;
};

export type SignUpResponse = {
	message: string;
};

export type VerifyEmailResponse = {
	message: string;
};

export type ForgotPasswordResponse = {
	message: string;
};

export type VerifyResetPasswordOtpResponse = {
	message: string;
};

export type ResetPasswordResponse = {
	message: string;
};

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

export enum UserRole {
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
