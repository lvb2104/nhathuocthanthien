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
			toast.info('Không có thay đổi nào được phát hiện');
			return;
		}

		toast.promise(
			mutateAsync(
				{ id: Number(id), request: requestData },
				{
					onError: (error: any) => {
						toast.error(
							error?.message || 'Lỗi khi cập nhật lô hàng. Vui lòng thử lại.',
						);
					},
				},
			).then(() => {
				if (onSuccess) {
					onSuccess();
				}
			}),
			{
				pending: 'Đang cập nhật lô hàng...',
				success: 'Đã cập nhật lô hàng thành công',
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
					<label className='text-sm font-medium'>Sản phẩm</label>
					<div className='p-3 bg-muted rounded-md text-sm'>
						{initialBatch.product?.name || 'Sản phẩm không xác định'}
					</div>
					<p className='text-xs text-muted-foreground'>
						Sản phẩm không thể thay đổi sau khi tạo lô hàng
					</p>
				</div>

				{/* Batch Code */}
				<FormField
					control={form.control}
					name='batchCode'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mã lô hàng</FormLabel>
							<FormControl>
								<Input placeholder='Nhập mã lô hàng' type='text' {...field} />
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
							<FormLabel>Số lượng</FormLabel>
							<FormControl>
								<Input placeholder='100' type='number' {...field} />
							</FormControl>
							<p className='text-xs text-muted-foreground'>
								Thay đổi số lượng sẽ tạo bản ghi biến động kho
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
							<FormLabel>Ngày hết hạn</FormLabel>
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
							<FormLabel>Ngày nhập hàng</FormLabel>
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
							<FormLabel>Ghi chú</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập thông tin ghi chú cho lô hàng này...'
									className='resize-none'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<LoadingButton
					text='Cập nhật lô hàng'
					isLoading={isPending}
					loadingText='Đang cập nhật...'
				/>
			</form>
		</Form>
	);
}
