import z from 'zod';

export const ShippingAddressSchema = z.object({
	fullName: z.string().min(1, 'Tên người nhận là bắt buộc'),
	phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
	addressLine: z.string().min(1, 'Địa chỉ cụ thể là bắt buộc'),
	ward: z.string().optional(),
	district: z.string().optional(),
	province: z.string().optional(),
	note: z.string().optional(),
	isDefault: z.boolean().optional(),
});
