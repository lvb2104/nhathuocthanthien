'use client'
import Image from 'next/image'
import React from 'react'
import mail from '@/assets/icons/mail.png'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { routes } from '@/configs/routes'
import LoadingButton from '@/components/custom/loading-button'
import Link from 'next/link'
import { useSignIn } from '@/hooks'
import CustomPasswordInput from '@/components/custom/custom-password-input'
import CustomInput from '@/components/custom/custom-input'

const formSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
})

function SignInForm() {
	const { mutate, isPending } = useSignIn()
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(values, {
			onSuccess: () => {
				toast.success('Đăng nhập thành công!')
				router.push(routes.home)
			},
		})
	}
	return (
		<div className='max-w-md mx-auto'>
			<div className='flex justify-center mb-6'>
				<div className='flex items-center gap-2 px-8 py-3 bg-white border-2 border-amber-600 text-amber-600 rounded-full font-semibold'>
					<div className='rounded-full flex items-center justify-center'>
						<Image src={mail} alt='Mail' width={35} height={35} />
					</div>
					Đăng nhập bằng Email
				</div>
			</div>
			<Form {...form}>
				<div className='bg-white rounded-2xl shadow-lg p-8'>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
								<Link href={routes.signUp} className='text-[#189DFE]'>
									Đăng ký
								</Link>{' '}
							</div>
							<div>
								Quên mật khẩu?{' '}
								<Link href={routes.forgotPassword} className='text-[#189DFE]'>
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
	)
}

export default SignInForm
