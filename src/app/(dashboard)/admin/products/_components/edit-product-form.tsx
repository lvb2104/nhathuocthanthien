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
import { CloudUpload, Paperclip, X } from 'lucide-react';
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from '@/components/ui/file-upload';
import { toast } from 'react-toastify';
import { Category, ProductWithoutDetail } from '@/types';
import { UpdateProductSchema } from '@/schemas';
import LoadingButton from '@/components/custom/loading-button';
import { useProduct, useUpdateProduct } from '@/hooks';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import Image from 'next/image';

export default function EditProductForm({
	initialCategories,
	initialProduct,
	id,
	onSuccess,
}: {
	initialCategories?: Category[];
	initialProduct?: ProductWithoutDetail;
	id: string;
	onSuccess?: () => void;
}) {
	const {
		data: productData,
		isError: isProductError,
		isPending: isProductPending,
	} = useProduct(Number(id));
	const [files, setFiles] = useState<File[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const { mutateAsync, isPending } = useUpdateProduct();
	const router = useRouter();

	useEffect(() => {
		if (isProductError) {
			toast.error('Lỗi khi tải dữ liệu sản phẩm');
		}
	}, [isProductError]);

	// Create preview URLs when files change
	useEffect(() => {
		// Revoke old URLs to prevent memory leaks
		previewUrls.forEach(url => URL.revokeObjectURL(url));

		// Create new preview URLs
		const newPreviewUrls = files.map(file => URL.createObjectURL(file));
		setPreviewUrls(newPreviewUrls);

		// Cleanup function to revoke URLs when unmounting
		return () => {
			newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files]);

	const dropZoneConfig = {
		maxFiles: 5,
		maxSize: 1024 * 1024 * 4,
		multiple: true,
	};

	// Initialize form WITH the correct values from initialProduct from the start
	// This ensures the Select component renders with the correct value immediately
	const form = useForm<z.infer<typeof UpdateProductSchema>>({
		resolver: zodResolver(UpdateProductSchema),
		defaultValues: {
			name: initialProduct?.name || '',
			description: initialProduct?.description || '',
			price: initialProduct?.price?.toString() || '',
			manufacturer: initialProduct?.manufacturer || '',
			categoryId: initialProduct?.categoryId?.toString() || '',
			detail: {
				composition: '',
				usageText: '',
				dosage: '',
				targetUser: '',
				warning: '',
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
				{ id: Number(id), request: fd },
				{
					onError: (error: any) => {
						toast.error(error?.message || 'Lỗi khi cập nhật sản phẩm');
					},
				},
			).then(() => {
				if (onSuccess) {
					onSuccess();
				} else {
					router.back();
				}
			}),
			{
				pending: 'Đang cập nhật sản phẩm...',
				success: 'Đã cập nhật sản phẩm thành công',
			},
		);
	}

	// Only update detail fields from productData (since initialProduct doesn't have them)
	useEffect(() => {
		if (productData?.detail) {
			form.setValue('detail.composition', productData.detail.composition || '');
			form.setValue('detail.usageText', productData.detail.usageText || '');
			form.setValue('detail.dosage', productData.detail.dosage || '');
			form.setValue('detail.targetUser', productData.detail.targetUser || '');
			form.setValue('detail.warning', productData.detail.warning || '');
		}
	}, [productData, form]);

	if (isProductPending) {
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
							<FormLabel>Tên sản phẩm *</FormLabel>
							<FormControl>
								<Input placeholder='Nhập tên sản phẩm' type='text' {...field} />
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
							<FormLabel>Mô tả</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập mô tả sản phẩm'
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
							<FormLabel>Giá bán *</FormLabel>
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
							<FormLabel>Nhà sản xuất</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập tên nhà sản xuất'
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
					name='categoryId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Danh mục *</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Chọn danh mục' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{initialCategories?.map((category: Category) => (
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
							<FormLabel>Thành phần</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập thành phần thuốc'
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
					name='detail.usageText'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cách dùng</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập cách dùng'
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
					name='detail.dosage'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Liều dùng</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập liều dùng'
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
					name='detail.targetUser'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Đối tượng sử dụng</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập đối tượng sử dụng'
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
					name='detail.warning'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cảnh báo</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Nhập các cảnh báo, thận trọng khi dùng thuốc'
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
					name='images'
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					render={({ field }) => (
						<FormItem>
							<FormLabel>Hình ảnh</FormLabel>
							<FormControl>
								<div className='space-y-4'>
									{/* Image Preview Grid */}
									{previewUrls.length > 0 && (
										<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
											{previewUrls.map((url, index) => (
												<div
													key={index}
													className='relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group'
												>
													<Image
														src={url}
														alt={`Preview ${index + 1}`}
														fill
														className='object-cover'
													/>
													<button
														type='button'
														onClick={() => {
															const newFiles = files.filter(
																(_, i) => i !== index,
															);
															setFiles(newFiles);
														}}
														className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
													>
														<X className='h-4 w-4' />
													</button>
												</div>
											))}
										</div>
									)}

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
													<span className='font-semibold'>Nhấn để tải lên</span>
													&nbsp; hoặc kéo thả vào đây
												</p>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													Chấp nhận SVG, PNG, JPG hoặc GIF
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
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<LoadingButton
					text='Cập nhật'
					isLoading={isPending}
					loadingText='Đang xử lý...'
				/>
			</form>
		</Form>
	);
}
