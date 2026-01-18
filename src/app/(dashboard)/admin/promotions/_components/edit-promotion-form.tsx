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
import { Textarea } from '@/components/ui/textarea';
import { useUpdatePromotion } from '@/hooks';
import { Promotion, UpdatePromotionRequest } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const updatePromotionSchema = z
	.object({
		code: z
			.string()
			.min(1, { message: 'Vui lòng nhập mã khuyến mãi' })
			.optional(),
		description: z
			.string()
			.min(1, { message: 'Vui lòng nhập mô tả' })
			.optional(),
		discountPercent: z
			.number()
			.min(0, { message: 'Phần trăm giảm giá phải ít nhất là 0' })
			.max(100, { message: 'Phần trăm giảm giá không thể vượt quá 100' })
			.optional(),
		startDate: z
			.string()
			.min(1, { message: 'Vui lòng chọn ngày bắt đầu' })
			.optional(),
		endDate: z
			.string()
			.min(1, { message: 'Vui lòng chọn ngày kết thúc' })
			.optional(),
	})
	.refine(
		data => {
			if (data.startDate && data.endDate) {
				const start = new Date(data.startDate);
				const end = new Date(data.endDate);
				return end >= start;
			}
			return true;
		},
		{
			message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
			path: ['endDate'],
		},
	);

type EditPromotionFormProps = {
	promotion: Promotion;
	onSuccess?: () => void;
};

export default function EditPromotionForm({
	promotion,
	onSuccess,
}: EditPromotionFormProps) {
	const { mutateAsync, isPending } = useUpdatePromotion();

	const form = useForm<UpdatePromotionRequest>({
		resolver: zodResolver(updatePromotionSchema),
		defaultValues: {
			code: promotion.code,
			description: promotion.description,
			discountPercent: promotion.discountPercent,
			startDate: promotion.startDate.includes('T')
				? promotion.startDate.split('T')[0]
				: promotion.startDate, // Extract date part from ISO string
			endDate: promotion.endDate.includes('T')
				? promotion.endDate.split('T')[0]
				: promotion.endDate,
		},
	});

	async function onSubmit(data: UpdatePromotionRequest) {
		try {
			await mutateAsync({ id: promotion.id, request: data });
			toast.success('Đã cập nhật chương trình khuyến mãi thành công');
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Lỗi khi cập nhật chương trình khuyến mãi');
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-6'>
				<FormField
					control={form.control}
					name='code'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã khuyến mãi *</FormLabel>
							<FormControl>
								<Input
									placeholder='Nhập mã khuyến mãi (Ví dụ: GIAMGIA20)'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mô tả *</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập mô tả chương trình khuyến mãi'
									className='resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='discountPercent'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phần trăm giảm giá (%) *</FormLabel>
							<FormControl>
								<Input
									type='number'
									min={0}
									max={100}
									placeholder='Nhập phần trăm giảm giá (0-100)'
									{...field}
									onChange={e =>
										field.onChange(parseFloat(e.target.value) || 0)
									}
									value={field.value || ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='startDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày bắt đầu *</FormLabel>
							<FormControl>
								<Input type='date' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='endDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ngày kết thúc *</FormLabel>
							<FormControl>
								<Input type='date' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-end gap-2'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Đang cập nhật...' : 'Cập nhật khuyến mãi'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
