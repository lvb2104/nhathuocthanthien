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
			.min(1, { message: 'Promotion code is required' })
			.optional(),
		description: z
			.string()
			.min(1, { message: 'Description is required' })
			.optional(),
		discountPercent: z
			.number()
			.min(0, { message: 'Discount percent must be at least 0' })
			.max(100, { message: 'Discount percent cannot exceed 100' })
			.optional(),
		startDate: z
			.string()
			.min(1, { message: 'Start date is required' })
			.optional(),
		endDate: z.string().min(1, { message: 'End date is required' }).optional(),
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
			message: 'End date must be after start date',
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
			toast.success('Promotion updated successfully');
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Error updating promotion');
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
							<FormLabel>Promotion Code</FormLabel>
							<FormControl>
								<Input
									placeholder='Enter promotion code (e.g., SAVE20)'
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
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Enter promotion description'
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
							<FormLabel>Discount Percent (%)</FormLabel>
							<FormControl>
								<Input
									type='number'
									min={0}
									max={100}
									placeholder='Enter discount percent (0-100)'
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
							<FormLabel>Start Date</FormLabel>
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
							<FormLabel>End Date</FormLabel>
							<FormControl>
								<Input type='date' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-end gap-2'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Updating...' : 'Update Promotion'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
