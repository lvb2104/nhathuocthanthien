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
import { useCreatePromotion } from '@/hooks';
import { CreatePromotionRequest } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const createPromotionSchema = z
	.object({
		code: z.string().min(1, { message: 'Vui lòng nhập mã khuyến mãi' }),
		description: z.string().min(1, { message: 'Vui lòng nhập mô tả' }),
		discountPercent: z
			.number()
			.min(0, { message: 'Phần trăm giảm giá phải ít nhất là 0' })
			.max(100, { message: 'Phần trăm giảm giá không thể vượt quá 100' }),
		startDate: z.string().min(1, { message: 'Vui lòng chọn ngày bắt đầu' }),
		endDate: z.string().min(1, { message: 'Vui lòng chọn ngày kết thúc' }),
	})
	.refine(
		data => {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			return end >= start;
		},
		{
			message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
			path: ['endDate'],
		},
	);

type CreatePromotionFormProps = {
	onSuccess?: () => void;
};

export default function CreatePromotionForm({
	onSuccess,
}: CreatePromotionFormProps) {
	const { mutateAsync, isPending } = useCreatePromotion();

	const form = useForm<CreatePromotionRequest>({
		resolver: zodResolver(createPromotionSchema),
		defaultValues: {
			code: '',
			description: '',
			discountPercent: 0,
			startDate: '',
			endDate: '',
		},
	});

	async function onSubmit(data: CreatePromotionRequest) {
		try {
			await mutateAsync(data);
			toast.success('Đã tạo chương trình khuyến mãi thành công');
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Lỗi khi tạo chương trình khuyến mãi');
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
						{isPending ? 'Đang tạo...' : 'Tạo khuyến mãi'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
