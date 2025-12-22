import z from 'zod';

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

export const VerifyResetPasswordOtpFormSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	otp: z.string().min(6, { message: 'Mã OTP phải có 6 chữ số' }),
});

export const SignUpRequestSchema = SignUpFormSchema.omit({
	confirmedPassword: true,
});

export const ResetPasswordRequestSchema = ResetPasswordFormSchema.omit({
	confirmedPassword: true,
});
