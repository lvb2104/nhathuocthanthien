'use client';
import Image from 'next/image';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { routes } from '@/configs/routes';
import LoadingButton from '@/components/custom/loading-button';
import { useForgotPassword } from '@/hooks';
import CustomInput from '@/components/custom/custom-input';
import { ForgotPasswordFormSchema } from '@/types';

function ForgotPasswordForm() {
	const { mutateAsync, isPending } = useForgotPassword();
	const router = useRouter();

	const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
		resolver: zodResolver(ForgotPasswordFormSchema),
	});

	function handleSubmit(values: z.infer<typeof ForgotPasswordFormSchema>) {
		toast.promise(
			mutateAsync(values, {
				onError: (error: any) => {
					toast.error(
						error?.message || 'Đã xảy ra lỗi khi gửi email đặt lại mật khẩu',
					);
				},
			}).then(() => {
				router.replace(routes.auth.verifyResetPasswordOtp);
			}),
			{
				pending: 'Đang gửi email đặt lại mật khẩu...',
				success:
					'Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư đến.',
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
					Đặt lại mật khẩu bằng email
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
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<CustomInput
											placeholder='Nhập email để đặt lại mật khẩu'
											autoFocus
											{...field}
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<LoadingButton
							isLoading={isPending}
							loadingText='Đang xử lý...'
							text='Gửi'
						/>
					</form>
				</div>
			</Form>
		</div>
	);
}

export default ForgotPasswordForm;
