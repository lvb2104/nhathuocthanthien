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
	FormMessage,
} from '@/components/ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { routes } from '@/configs/routes'
import LoadingButton from '@/components/ui/loading-button'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useAuthStore } from '@/store'
import { useVerifyResetPasswordOtp } from '@/hooks'

const formSchema = z.object({
	email: z.string().email({ message: 'Email không hợp lệ' }),
	otp: z.string().min(6, { message: 'Mã OTP phải có 6 chữ số' }),
})

function VerifyResetPasswordOtpForm() {
	const { emailPendingVerification } = useAuthStore()
	const { mutate, isPending } = useVerifyResetPasswordOtp()
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: emailPendingVerification,
			otp: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(values, {
			onSuccess: () => {
				toast.success('Xác minh email thành công! Vui lòng nhập mật khẩu mới.')
				router.push(routes.resetPassword)
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
					Xác minh mã OTP
				</div>
			</div>
			<Form {...form}>
				<div className='bg-white rounded-2xl shadow-lg p-8'>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='otp'
							render={({ field }) => (
								<FormItem className='flex justify-center'>
									<FormControl>
										<InputOTP
											maxLength={6}
											pattern={REGEXP_ONLY_DIGITS}
											autoFocus
											{...field}
										>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
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
	)
}

export default VerifyResetPasswordOtpForm
