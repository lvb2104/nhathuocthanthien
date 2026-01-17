'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/custom/password-input';
import { useChangePassword } from '@/hooks';
import { ChangePasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordForm() {
	const { mutateAsync, isPending } = useChangePassword();

	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(data: ChangePasswordFormData) {
		try {
			await mutateAsync({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
			toast.success('Đổi mật khẩu thành công');
			form.reset();
		} catch (error: any) {
			toast.error(error?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='currentPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mật khẩu hiện tại *</FormLabel>
							<FormControl>
								<PasswordInput
									placeholder='Nhập mật khẩu hiện tại'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='newPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mật khẩu mới *</FormLabel>
							<FormControl>
								<PasswordInput placeholder='Nhập mật khẩu mới' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Xác nhận mật khẩu mới *</FormLabel>
							<FormControl>
								<PasswordInput placeholder='Nhập lại mật khẩu mới' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-end'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
