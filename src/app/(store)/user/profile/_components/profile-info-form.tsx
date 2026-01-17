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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUpdateUserProfile } from '@/hooks';
import { UpdateUserProfileSchema } from '@/schemas';
import { UserGender, UserInfo } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useState } from 'react';
import { Upload } from 'lucide-react';

type UpdateUserProfileFormData = z.infer<typeof UpdateUserProfileSchema>;

type ProfileInfoFormProps = {
	userProfile: UserInfo;
};

export default function ProfileInfoForm({ userProfile }: ProfileInfoFormProps) {
	const { mutateAsync, isPending } = useUpdateUserProfile();
	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		userProfile.avatarUrl,
	);

	const form = useForm<UpdateUserProfileFormData>({
		resolver: zodResolver(UpdateUserProfileSchema),
		defaultValues: {
			fullName: userProfile.fullName || '',
			phone: userProfile.phone || '',
			gender: userProfile.gender || undefined,
			birthDay: userProfile.birthDay ? userProfile.birthDay.split('T')[0] : '',
			avatar: undefined,
		},
	});

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue('avatar', file);
			// Create preview URL
			const reader = new FileReader();
			// Set up event handler when file is loaded
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	async function onSubmit(data: UpdateUserProfileFormData) {
		try {
			// Convert to FormData
			const formData = new FormData();
			formData.append('fullName', data.fullName);
			if (data.phone) formData.append('phone', data.phone);
			if (data.gender) formData.append('gender', data.gender);
			if (data.birthDay) formData.append('birthDay', data.birthDay);
			if (data.avatar) formData.append('avatar', data.avatar);

			await mutateAsync(formData);
			toast.success('Cập nhật thông tin thành công');
		} catch (error: any) {
			toast.error(error?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
		}
	}

	// Get initials for avatar fallback
	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				{/* Avatar Section */}
				<div className='flex flex-col items-center gap-4'>
					<Avatar className='h-24 w-24'>
						<AvatarImage
							src={avatarPreview || undefined}
							alt={userProfile.fullName}
						/>
						<AvatarFallback className='text-2xl'>
							{getInitials(userProfile.fullName)}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col items-center gap-2'>
						<label
							htmlFor='avatar-upload'
							className='cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
						>
							<Upload className='h-4 w-4' />
							Tải ảnh lên
						</label>
						<input
							id='avatar-upload'
							type='file'
							accept='image/jpeg,image/jpg,image/png,image/webp'
							className='hidden'
							onChange={handleAvatarChange}
						/>
						<p className='text-xs text-muted-foreground'>
							JPG, PNG hoặc WebP. Tối đa 5MB.
						</p>
						{form.formState.errors.avatar && (
							<p className='text-xs text-destructive'>
								{form.formState.errors.avatar.message}
							</p>
						)}
					</div>
				</div>

				{/* Form Fields */}
				<div className='grid gap-4 md:grid-cols-2'>
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

					<FormItem>
						<FormLabel>Email</FormLabel>
						<Input
							value={userProfile.email}
							disabled
							className='bg-muted cursor-not-allowed'
						/>
						<p className='text-xs text-muted-foreground'>
							Email không thể thay đổi
						</p>
					</FormItem>

					<FormField
						control={form.control}
						name='gender'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Giới tính</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value || undefined}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Chọn giới tính' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value={UserGender.MALE}>Nam</SelectItem>
										<SelectItem value={UserGender.FEMALE}>Nữ</SelectItem>
										<SelectItem value={UserGender.OTHER}>Khác</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='birthDay'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ngày sinh</FormLabel>
								<FormControl>
									<Input type='date' {...field} value={field.value || ''} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Submit Button */}
				<div className='flex justify-end'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
