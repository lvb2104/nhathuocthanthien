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
import { useSignIn } from '@/hooks/use-sign-in'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { routes } from '@/configs/routes'
import LoadingButton from '@/components/ui/loading-button'
import { PasswordInput } from '@/components/ui/password-input'

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
										<Input
											placeholder='Nhập email'
											autoFocus
											{...field}
											className='focus-visible:ring-0'
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
										<PasswordInput
											placeholder='Nhập mật khẩu'
											{...field}
											className='focus-visible:ring-0'
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<LoadingButton isLoading={isPending} text='Đăng nhập' />
					</form>
				</div>
			</Form>
		</div>
	)
}

export default SignInForm
