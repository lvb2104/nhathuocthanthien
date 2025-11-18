'use client';
import Image from 'next/image';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { routes } from '@/configs/routes';
import LoadingButton from '@/components/custom/loading-button';
import { InputOTP, InputOTPGroup } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useAuthStore } from '@/store';
import { useForgotPassword, useVerifyResetPasswordOtp } from '@/hooks';
import CustomInputOTPSlot from '@/components/custom/custom-input-otp-slot';
import ResendOtpButton from '@/components/custom/resend-otp-button';
import { VerifyResetPasswordOtpFormSchema } from '@/types';

function VerifyResetPasswordOtpForm() {
	const { emailPendingVerification } = useAuthStore();
	const { mutateAsync: mutateAsyncVerifyReset, isPending: isPendingVerify } =
		useVerifyResetPasswordOtp();
	const { mutateAsync: mutateAsyncForgotPassword, isPending: isPendingForgot } =
		useForgotPassword();
	const router = useRouter();

	const form = useForm<z.infer<typeof VerifyResetPasswordOtpFormSchema>>({
		resolver: zodResolver(VerifyResetPasswordOtpFormSchema),
		defaultValues: {
			email: emailPendingVerification,
		},
	});

	function handleSubmit(
		values: z.infer<typeof VerifyResetPasswordOtpFormSchema>,
	) {
		if (!values.email) return;
		toast.promise(
			mutateAsyncVerifyReset(values, {
				onError: (error: any) => {
					toast.error(
						error?.message ||
							'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
					);
				},
			}).then(() => {
				router.replace(routes.auth.resetPassword);
			}),
			{
				pending: 'Đang xác minh mã OTP...',
				success: 'Xác minh mã OTP thành công! Vui lòng nhập mật khẩu mới.',
			},
		);
	}

	function handleResendOtp() {
		if (!emailPendingVerification) return;
		form.setValue('otp', '');
		toast.promise(
			mutateAsyncForgotPassword(
				{
					email: emailPendingVerification,
				},
				{
					onError: (error: any) => {
						toast.error(
							error?.message || 'Gửi lại mã OTP thất bại! Vui lòng thử lại.',
						);
					},
				},
			),
			{
				pending: 'Đang gửi lại mã OTP...',
				success: 'Gửi lại mã OTP thành công! Vui lòng kiểm tra email.',
			},
		);
	}

	return (
		<div className='max-w-md mx-auto'>
			<div className='flex justify-center mb-6'>
				<div className='flex items-center gap-2 px-8 py-3 bg-white border-2 border-amber-600 text-amber-600 rounded-full font-semibold'>
					<div className='rounded-full flex items-center justify-center'>
						<Image src='/icons/mail.png' alt='Mail' width={35} height={35} />
					</div>
					Xác minh mã OTP
				</div>
			</div>
			<Form {...form}>
				<div className='bg-white rounded-2xl shadow-lg p-8'>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='otp'
							render={({ field }) => (
								<FormItem className='flex flex-col items-center'>
									<FormControl>
										<InputOTP
											maxLength={6}
											pattern={REGEXP_ONLY_DIGITS}
											autoFocus
											{...field}
										>
											<InputOTPGroup>
												<CustomInputOTPSlot index={0} autoFocus />
												<CustomInputOTPSlot index={1} />
												<CustomInputOTPSlot index={2} />
												<CustomInputOTPSlot index={3} />
												<CustomInputOTPSlot index={4} />
												<CustomInputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<ResendOtpButton onResendOtp={() => handleResendOtp()} />
						<LoadingButton
							isLoading={isPendingVerify || isPendingForgot}
							loadingText='Đang xử lý...'
							text='Gửi'
						/>
					</form>
				</div>
			</Form>
		</div>
	);
}

export default VerifyResetPasswordOtpForm;
