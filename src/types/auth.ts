import z from 'zod';

// Validation Schemas
export const SignInFormSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

export const SignUpFormSchema = z
	.object({
		email: z.string().email({ message: 'Email không hợp lệ' }),
		password: z
			.string()
			.min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
		confirmedPassword: z
			.string()
			.min(6, { message: 'Mật khẩu xác nhận phải có ít nhất 6 ký tự' }),
		fullName: z
			.string()
			.min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
	})
	.refine(data => data.password === data.confirmedPassword, {
		message: 'Mật khẩu xác nhận không khớp',
		path: ['confirmedPassword'],
	});

export const SignUpRequestSchema = SignUpFormSchema.omit({
	confirmedPassword: true,
});

export const VerifyEmailFormSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	otp: z.string().min(6, { message: 'Mã OTP phải có 6 chữ số' }),
});

export const ForgotPasswordFormSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
});

export const ResetPasswordFormSchema = z
	.object({
		email: z.string().email({ message: 'Email không hợp lệ' }),
		newPassword: z
			.string()
			.min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
		confirmedPassword: z
			.string()
			.min(6, { message: 'Mật khẩu xác nhận phải có ít nhất 6 ký tự' }),
	})
	.refine(data => data.newPassword === data.confirmedPassword, {
		message: 'Mật khẩu xác nhận không khớp',
		path: ['confirmedPassword'],
	});

export const ResetPasswordRequestSchema = ResetPasswordFormSchema.omit({
	confirmedPassword: true,
});

export const VerifyResetPasswordOtpFormSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	otp: z.string().min(6, { message: 'Mã OTP phải có 6 chữ số' }),
});

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
