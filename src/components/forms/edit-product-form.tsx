'use client';
import { useEffect, useState } from 'react';
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
import { CloudUpload, Paperclip } from 'lucide-react';
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from '@/components/ui/file-upload';
import { toast } from 'react-toastify';
import { Category, GetProductByIdResponse, UpdateProductSchema } from '@/types';
import LoadingButton from '../custom/loading-button';
import { useCategories } from '@/hooks/use-categories';
import { useProduct, useUpdateProduct } from '@/hooks';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

export default function EditProductForm({
	initialCategories,
	initialProduct,
	id,
}: {
	initialCategories?: Category[];
	initialProduct?: GetProductByIdResponse;
	id: string;
}) {
	const {
		data,
		isError,
		isPending: isCategoriesPending,
	} = useCategories(initialCategories);
	const {
		data: productData,
		isError: isProductError,
		isPending: isProductPending,
	} = useProduct(Number(id), initialProduct);
	const [files, setFiles] = useState<File[]>([]);
	const { mutateAsync, isPending } = useUpdateProduct();
	const router = useRouter();

	useEffect(() => {
		if (isError) {
			toast.error('Error fetching categories');
		}
		if (isProductError) {
			toast.error('Error fetching product data');
		}
	}, [isError, isProductError]);

	const dropZoneConfig = {
		maxFiles: 5,
		maxSize: 1024 * 1024 * 4,
		multiple: true,
	};
	const form = useForm<z.infer<typeof UpdateProductSchema>>({
		resolver: zodResolver(UpdateProductSchema),
		defaultValues: {
			name: productData?.name || '',
			description: productData?.description || '',
			price: productData?.price?.toString() || '',
			manufacturer: productData?.manufacturer || '',
			categoryId: productData?.categoryId?.toString() || '',
			detail: {
				composition: productData?.detail?.composition || '',
				usageText: productData?.detail?.usageText || '',
				dosage: productData?.detail?.dosage || '',
				targetUser: productData?.detail?.targetUser || '',
				warning: productData?.detail?.warning || '',
			},
			images: [],
		},
	});

	function onSubmit(values: z.infer<typeof UpdateProductSchema>) {
		const fd = new FormData();
		fd.append('name', values.name);
		fd.append('description', values.description || '');
		fd.append('price', values.price);
		fd.append('manufacturer', values.manufacturer || '');
		fd.append('categoryId', values.categoryId);
		fd.append('detail[composition]', values.detail.composition || '');
		fd.append('detail[usageText]', values.detail.usageText || '');
		fd.append('detail[dosage]', values.detail.dosage || '');
		fd.append('detail[targetUser]', values.detail.targetUser || '');
		fd.append('detail[warning]', values.detail.warning || '');

		files.forEach(file => {
			fd.append('images', file);
		});

		toast.promise(
			mutateAsync(
				{ id: Number(id), updateProductRequest: fd },
				{
					onError: (error: any) => {
						toast.error(error?.message || 'Error updating product');
					},
				},
			).then(() => {
				router.back();
			}),
			{
				pending: 'Updating product...',
				success: 'Product updated successfully',
			},
		);
	}

	// Populate form with existing product data
	useEffect(() => {
		if (productData) {
			form.reset({
				name: productData.name || '',
				description: productData.description || '',
				price: productData.price?.toString() || '',
				manufacturer: productData.manufacturer || '',
				categoryId: productData.categoryId?.toString() || '',
				detail: {
					composition: productData.detail?.composition || '',
					usageText: productData.detail?.usageText || '',
					dosage: productData.detail?.dosage || '',
					targetUser: productData.detail?.targetUser || '',
					warning: productData.detail?.warning || '',
				},
			});
		}
	}, [productData, form]);

	if (isCategoriesPending || isProductPending) {
		return <Loading />;
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 max-w-3xl mx-auto py-10 w-[90%]'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder='Paracetamol 500mg 123'
									type='text'
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
									placeholder='Thuốc giảm đau, hạ sốt thông thường 123'
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
					name='price'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price</FormLabel>
							<FormControl>
								<Input placeholder='45000' type='number' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='manufacturer'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Manufacturer</FormLabel>
							<FormControl>
								<Input placeholder='PharmaVN 123' type='text' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='categoryId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a category to display' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{data?.map((category: Category) => (
										<SelectItem
											key={category.id}
											value={category.id.toString()}
										>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='detail.composition'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Composition</FormLabel>
							<FormControl>
								<Input placeholder='Paracetamol 500mg' type='text' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='detail.usageText'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Usage</FormLabel>
							<FormControl>
								<Input placeholder='Uống sau khi ăn' type='text' {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='detail.dosage'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Dosage</FormLabel>
							<FormControl>
								<Input
									placeholder='1–2 viên/lần, tối đa 4 lần/ngày'
									type='text'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='detail.targetUser'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Target User</FormLabel>
							<FormControl>
								<Input
									placeholder='Người lớn và trẻ em trên 12 tuổi'
									type='text'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='detail.warning'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Warning</FormLabel>
							<FormControl>
								<Input
									placeholder='Không dùng cho người dị ứng paracetamol'
									type='text'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='images'
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					render={({ field }) => (
						<FormItem>
							<FormLabel>Images</FormLabel>
							<FormControl>
								<FileUploader
									value={files}
									onValueChange={setFiles}
									dropzoneOptions={dropZoneConfig}
									className='relative bg-background rounded-lg p-2'
								>
									<FileInput
										id='fileInput'
										className='outline-dashed outline-1 outline-slate-500'
									>
										<div className='flex items-center justify-center flex-col p-8 w-full '>
											<CloudUpload className='text-gray-500 w-10 h-10' />
											<p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
												<span className='font-semibold'>Click to upload</span>
												&nbsp; or drag and drop
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												SVG, PNG, JPG or GIF
											</p>
										</div>
									</FileInput>
									<FileUploaderContent>
										{files &&
											files.length > 0 &&
											files.map((file, i) => (
												<FileUploaderItem key={i} index={i}>
													<Paperclip className='h-4 w-4 stroke-current' />
													<span>{file.name}</span>
												</FileUploaderItem>
											))}
									</FileUploaderContent>
								</FileUploader>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<LoadingButton
					text='Update'
					isLoading={isPending}
					loadingText='Processing...'
				/>
			</form>
		</Form>
	);
}
