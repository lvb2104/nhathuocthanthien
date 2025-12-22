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
		code: z.string().min(1, { message: 'Promotion code is required' }),
		description: z.string().min(1, { message: 'Description is required' }),
		discountPercent: z
			.number()
			.min(0, { message: 'Discount percent must be at least 0' })
			.max(100, { message: 'Discount percent cannot exceed 100' }),
		startDate: z.string().min(1, { message: 'Start date is required' }),
		endDate: z.string().min(1, { message: 'End date is required' }),
	})
	.refine(
		data => {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			return end >= start;
		},
		{
			message: 'End date must be after start date',
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
			toast.success('Promotion created successfully');
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Error creating promotion');
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
						{isPending ? 'Creating...' : 'Create Promotion'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
