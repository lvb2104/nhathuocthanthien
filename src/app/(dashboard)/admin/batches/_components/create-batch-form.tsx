'use client';
import { useEffect } from 'react';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import { ProductWithoutDetail } from '@/types';
import { CreateBatchSchema } from '@/schemas';
import { useCreateBatch, useProducts } from '@/hooks';
import LoadingButton from '@/components/custom/loading-button';

export default function CreateBatchForm({
	initialProducts,
	onSuccess,
}: {
	initialProducts?: ProductWithoutDetail[];
	onSuccess?: () => void;
}) {
	const { mutateAsync, isPending } = useCreateBatch();
	const { data: productsResponse, isError } = useProducts();

	const products = productsResponse?.data || initialProducts || [];

	useEffect(() => {
		if (isError) {
			toast.error('Error fetching products');
		}
	}, [isError]);

	const form = useForm<z.infer<typeof CreateBatchSchema>>({
		resolver: zodResolver(CreateBatchSchema),
		defaultValues: {
			productId: '',
			batchCode: '',
			quantity: '',
			expiryDate: '',
			receivedDate: '',
			note: '',
		},
	});

	function onSubmit(values: z.infer<typeof CreateBatchSchema>) {
		const requestData = {
			productId: Number(values.productId),
			quantity: Number(values.quantity),
			expiryDate: values.expiryDate,
			...(values.batchCode && { batchCode: values.batchCode }),
			...(values.receivedDate && { receivedDate: values.receivedDate }),
			...(values.note && { note: values.note }),
		};

		toast.promise(
			mutateAsync(requestData, {
				onError: (error: any) => {
					toast.error(
						error?.message || 'Error creating batch. Please try again.',
					);
				},
			}).then(() => {
				form.reset();
				if (onSuccess) {
					onSuccess();
				}
			}),
			{
				pending: 'Creating batch...',
				success: 'Batch created successfully',
			},
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 max-w-3xl mx-auto py-10 w-[90%]'
			>
				{/* Product Selection */}
				<FormField
					control={form.control}
					name='productId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Product</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a product' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{products?.map((product: ProductWithoutDetail) => (
										<SelectItem key={product.id} value={product.id.toString()}>
											{product.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Batch Code */}
				<FormField
					control={form.control}
					name='batchCode'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Batch Code (Optional)</FormLabel>
							<FormControl>
								<Input
									placeholder='LOT-2025-001 (auto-generated if not provided)'
									type='text'
									{...field}
								/>
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
							<FormLabel>Received Date (Optional)</FormLabel>
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
							<FormLabel>Note (Optional)</FormLabel>
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
					text='Create Batch'
					isLoading={isPending}
					loadingText='Creating...'
				/>
			</form>
		</Form>
	);
}
