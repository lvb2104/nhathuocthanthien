'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { toast } from 'react-toastify';
import { Batch } from '@/types';
import { UpdateBatchSchema } from '@/schemas';
import { useUpdateBatch } from '@/hooks';
import LoadingButton from '@/components/custom/loading-button';
import { format } from 'date-fns';

export default function EditBatchForm({
	initialBatch,
	id,
	onSuccess,
}: {
	initialBatch: Batch;
	id: string;
	onSuccess?: () => void;
}) {
	const { mutateAsync, isPending } = useUpdateBatch();

	// Format dates for input fields
	const formatDateForInput = (dateString?: string) => {
		if (!dateString) return '';
		try {
			return format(new Date(dateString), 'yyyy-MM-dd');
		} catch {
			return '';
		}
	};

	const form = useForm<z.infer<typeof UpdateBatchSchema>>({
		resolver: zodResolver(UpdateBatchSchema),
		defaultValues: {
			batchCode: initialBatch.batchCode || '',
			quantity: initialBatch.quantity?.toString() || '',
			expiryDate: formatDateForInput(initialBatch.expiryDate),
			receivedDate: formatDateForInput(initialBatch.receivedDate),
			note: initialBatch.note || '',
		},
	});

	function onSubmit(values: z.infer<typeof UpdateBatchSchema>) {
		const requestData: any = {};

		if (values.batchCode !== initialBatch.batchCode) {
			requestData.batchCode = values.batchCode;
		}
		if (values.quantity && Number(values.quantity) !== initialBatch.quantity) {
			requestData.quantity = Number(values.quantity);
		}
		if (
			values.expiryDate &&
			formatDateForInput(values.expiryDate) !==
				formatDateForInput(initialBatch.expiryDate)
		) {
			requestData.expiryDate = values.expiryDate;
		}
		if (
			values.receivedDate &&
			formatDateForInput(values.receivedDate) !==
				formatDateForInput(initialBatch.receivedDate)
		) {
			requestData.receivedDate = values.receivedDate;
		}
		if (values.note !== initialBatch.note) {
			requestData.note = values.note;
		}

		// If no changes were made
		if (Object.keys(requestData).length === 0) {
			toast.info('No changes detected');
			return;
		}

		toast.promise(
			mutateAsync(
				{ id: Number(id), request: requestData },
				{
					onError: (error: any) => {
						toast.error(
							error?.message || 'Error updating batch. Please try again.',
						);
					},
				},
			).then(() => {
				if (onSuccess) {
					onSuccess();
				}
			}),
			{
				pending: 'Updating batch...',
				success: 'Batch updated successfully',
			},
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 max-w-3xl mx-auto py-10 w-[90%]'
			>
				{/* Product (Read-only) */}
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Product</label>
					<div className='p-3 bg-muted rounded-md text-sm'>
						{initialBatch.product?.name || 'Unknown Product'}
					</div>
					<p className='text-xs text-muted-foreground'>
						Product cannot be changed after batch creation
					</p>
				</div>

				{/* Batch Code */}
				<FormField
					control={form.control}
					name='batchCode'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Batch Code</FormLabel>
							<FormControl>
								<Input placeholder='LOT-2025-001' type='text' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Quantity */}
				<FormField
					control={form.control}
					name='quantity'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Quantity</FormLabel>
							<FormControl>
								<Input placeholder='100' type='number' {...field} />
							</FormControl>
							<p className='text-xs text-muted-foreground'>
								Changing quantity will create a stock movement record
							</p>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Expiry Date */}
				<FormField
					control={form.control}
					name='expiryDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Expiry Date</FormLabel>
							<FormControl>
								<Input type='date' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Received Date */}
				<FormField
					control={form.control}
					name='receivedDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Received Date</FormLabel>
							<FormControl>
								<Input type='date' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Note */}
				<FormField
					control={form.control}
					name='note'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Note</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Additional notes about this batch...'
									className='resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<LoadingButton
					text='Update Batch'
					isLoading={isPending}
					loadingText='Updating...'
				/>
			</form>
		</Form>
	);
}
