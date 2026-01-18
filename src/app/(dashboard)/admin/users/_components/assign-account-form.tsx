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
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAssignAccount } from '@/hooks';
import { AssignAccountRequest } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const assignAccountSchema = z
	.object({
		fullName: z.string().min(1, { message: 'Vui lòng nhập họ và tên' }),
		email: z.string().email({ message: 'Địa chỉ email không hợp lệ' }),
		password: z
			.string()
			.min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
		phone: z.string().optional(),
		roleId: z.number({ message: 'Vui lòng chọn vai trò' }),
		hireDate: z.string().optional(),
		licenseNumber: z.string().optional(),
	})
	.refine(
		data => {
			// Employee (roleId 4) or Pharmacist (roleId 3) require hireDate
			if (data.roleId === 3 || data.roleId === 4) {
				return !!data.hireDate;
			}
			return true;
		},
		{
			message: 'Vui lòng nhập ngày vào làm cho Nhân viên và Dược sĩ',
			path: ['hireDate'],
		},
	)
	.refine(
		data => {
			// Pharmacist (roleId 3) requires licenseNumber
			if (data.roleId === 3) {
				return !!data.licenseNumber;
			}
			return true;
		},
		{
			message: 'Vui lòng nhập số giấy phép cho Dược sĩ',
			path: ['licenseNumber'],
		},
	);

type AssignAccountFormProps = {
	onSuccess?: () => void;
};

export default function AssignAccountForm({
	onSuccess,
}: AssignAccountFormProps) {
	const { mutateAsync, isPending } = useAssignAccount();

	const form = useForm<AssignAccountRequest>({
		resolver: zodResolver(assignAccountSchema),
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
			phone: '',
			roleId: undefined,
			hireDate: undefined,
			licenseNumber: undefined,
		},
	});

	const selectedRole = form.watch('roleId');
	const showHireDate = selectedRole === 3 || selectedRole === 4; // Pharmacist or Employee
	const showLicenseNumber = selectedRole === 3; // Pharmacist only

	async function onSubmit(data: AssignAccountRequest) {
		try {
			await mutateAsync(data);
			toast.success('Đã tạo tài khoản thành công');
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Lỗi khi tạo tài khoản');
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-6'>
				<FormField
					control={form.control}
					name='fullName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Họ và tên *</FormLabel>
							<FormControl>
								<Input placeholder='Nhập họ và tên' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email *</FormLabel>
							<FormControl>
								<Input type='email' placeholder='Nhập email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mật khẩu *</FormLabel>
							<FormControl>
								<Input type='password' placeholder='Nhập mật khẩu' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='phone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Số điện thoại</FormLabel>
							<FormControl>
								<Input placeholder='Nhập số điện thoại' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='roleId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Vai trò *</FormLabel>
							<Select
								onValueChange={value => field.onChange(Number(value))}
								value={field.value?.toString()}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Chọn vai trò' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='1'>Khách hàng</SelectItem>
									<SelectItem value='2'>Quản trị viên</SelectItem>
									<SelectItem value='3'>Dược sĩ</SelectItem>
									<SelectItem value='4'>Nhân viên giao hàng</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{showHireDate && (
					<FormField
						control={form.control}
						name='hireDate'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ngày vào làm *</FormLabel>
								<FormControl>
									<Input type='date' {...field} value={field.value || ''} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{showLicenseNumber && (
					<FormField
						control={form.control}
						name='licenseNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Số giấy phép *</FormLabel>
								<FormControl>
									<Input
										placeholder='Nhập số giấy phép'
										{...field}
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<div className='flex justify-end gap-2'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
