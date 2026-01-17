import { UserGender } from '@/types';
import z from 'zod';

export const UpdateUserProfileSchema = z.object({
	fullName: z
		.string()
		.min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' })
		.max(100, { message: 'Họ và tên không được quá 100 ký tự' }),
	phone: z
		.string()
		.min(10, { message: 'Số điện thoại phải có ít nhất 10 số' })
		.max(15, { message: 'Số điện thoại không hợp lệ' })
		.optional()
		.or(z.literal('')),
	gender: z
		.enum([UserGender.MALE, UserGender.FEMALE, UserGender.OTHER])
		.optional(),
	birthDay: z.string().optional().or(z.literal('')),
	avatar: z
		.instanceof(File)
		.refine(file => file.size <= 5 * 1024 * 1024, {
			message: 'Kích thước ảnh không được vượt quá 5MB',
		})
		.refine(
			file =>
				['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
					file.type,
				),
			{
				message: 'Chỉ chấp nhận file ảnh định dạng JPEG, PNG hoặc WebP',
			},
		)
		.optional(),
});

export const ChangePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, { message: 'Mật khẩu hiện tại là bắt buộc' }),
		newPassword: z
			.string()
			.min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
		confirmPassword: z
			.string()
			.min(6, { message: 'Mật khẩu xác nhận phải có ít nhất 6 ký tự' }),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Mật khẩu xác nhận không khớp',
		path: ['confirmPassword'],
	});
