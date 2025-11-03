'use client';
import Image from 'next/image';
import React from 'react';
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
import { omit } from 'lodash';
import Link from 'next/link';
import { useResetPassword } from '@/hooks';
import { useAuthStore } from '@/store';
import CustomPasswordInput from '@/components/custom/custom-password-input';

const formSchema = z
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

function ResetPasswordForm() {
	const { mutate, isPending } = useResetPassword();
	const { emailPendingVerification } = useAuthStore();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: emailPendingVerification,
			newPassword: '',
			confirmedPassword: '',
		},
	});

	function handleSubmit(values: z.infer<typeof formSchema>) {
		mutate(omit(values, ['confirmedPassword']), {
			onSuccess: () => {
				toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
				router.push(routes.auth.signIn); // Redirect to sign in page
			},
		});
	}
	return (
		<div className='max-w-md mx-auto'>
			<div className='flex justify-center mb-6'>
				<div className='flex items-center gap-2 px-8 py-3 bg-white border-2 border-amber-600 text-amber-600 rounded-full font-semibold'>
					<div className='rounded-full flex items-center justify-center'>
						<Image src='/icons/mail.png' alt='Mail' width={35} height={35} />
					</div>
					Đặt lại mật khẩu
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
							name='newPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mật khẩu</FormLabel>
									<FormControl>
										<CustomPasswordInput
											placeholder='Nhập mật khẩu mới'
											{...field}
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='confirmedPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Xác nhận mật khẩu</FormLabel>
									<FormControl>
										<CustomPasswordInput
											placeholder='Nhập lại mật khẩu'
											{...field}
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='text-sm flex justify-between'>
							<div>
								Đã có tài khoản?{' '}
								<Link href={routes.auth.signIn} className='text-[#189DFE]'>
									Đăng nhập
								</Link>{' '}
							</div>
						</div>
						<LoadingButton
							isLoading={isPending}
							loadingText='Đang xử lý...'
							text='Đặt lại mật khẩu'
						/>
					</form>
				</div>
			</Form>
		</div>
	);
}

export default ResetPasswordForm;
