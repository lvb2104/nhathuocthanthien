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
import { useSearchParams } from 'next/navigation';
import { routes } from '@/configs/routes';
import LoadingButton from '@/components/custom/loading-button';
import Link from 'next/link';
import { useSignIn } from '@/hooks';
import CustomPasswordInput from '@/components/custom/custom-password-input';
import CustomInput from '@/components/custom/custom-input';
import { SignInFormSchema } from '@/schemas';
import { useSession } from 'next-auth/react';

function SignInForm() {
	const { mutateAsync, isPending } = useSignIn();
	const searchParams = useSearchParams();
	const { update } = useSession();

	const form = useForm<z.infer<typeof SignInFormSchema>>({
		resolver: zodResolver(SignInFormSchema),
	});

	async function handleSubmit(values: z.infer<typeof SignInFormSchema>) {
		try {
			await mutateAsync(values);

			// Force session update to ensure middleware recognizes the new session
			await update();

			// Small delay to ensure session cookie is propagated
			await new Promise(resolve => setTimeout(resolve, 100));

			toast.success('Đăng nhập thành công!');

			// Get the callback URL from search params, default to home if not present
			const callbackUrl = searchParams.get('callbackUrl') || routes.home;

			// Use window.location for a hard navigation to ensure session is recognized
			window.location.href = callbackUrl;
		} catch (error: any) {
			toast.error(error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
		}
	}
	return (
		<div className='max-w-md mx-auto'>
			<div className='flex justify-center mb-6'>
				<div className='flex items-center gap-2 px-8 py-3 bg-white border-2 border-amber-600 text-amber-600 rounded-full font-semibold'>
					<div className='rounded-full flex items-center justify-center'>
						<Image src='/icons/mail.png' alt='Mail' width={35} height={35} />
					</div>
					Đăng nhập bằng Email
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
											placeholder='Nhập email'
											autoFocus
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
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mật khẩu</FormLabel>
									<FormControl>
										<CustomPasswordInput
											placeholder='Nhập mật khẩu'
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
								Chưa có tài khoản?{' '}
								<Link href={routes.auth.signUp} className='text-[#189DFE]'>
									Đăng ký
								</Link>{' '}
							</div>
							<div>
								Quên mật khẩu?{' '}
								<Link
									href={routes.auth.forgotPassword}
									className='text-[#189DFE]'
								>
									Lấy lại
								</Link>
							</div>
						</div>
						<LoadingButton
							isLoading={isPending}
							loadingText='Đang xử lý...'
							text='Đăng nhập'
						/>
					</form>
				</div>
			</Form>
		</div>
	);
}

export default SignInForm;
