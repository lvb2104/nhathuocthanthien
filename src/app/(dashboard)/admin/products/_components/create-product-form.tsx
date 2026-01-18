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
import { Category } from '@/types';
import { CreateProductSchema } from '@/schemas';
import { useCategories } from '@/hooks';
import { useCreateProduct } from '@/hooks';
import LoadingButton from '@/components/custom/loading-button';
import Image from 'next/image';

export default function CreateProductForm({
	initialCategories,
	onSuccess,
}: {
	initialCategories?: Category[];
	onSuccess?: () => void;
}) {
	const { mutateAsync, isPending } = useCreateProduct();
	const { data: response, isError } = useCategories();
	const [files, setFiles] = useState<File[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);

	const categories = response?.data || initialCategories || [];

	useEffect(() => {
		if (isError) {
			toast.error('Lỗi khi tải danh mục');
		}
	}, [isError]);

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
	const form = useForm<z.infer<typeof CreateProductSchema>>({
		resolver: zodResolver(CreateProductSchema),
		defaultValues: {
			name: '',
			description: '',
			price: '',
			manufacturer: '',
			categoryId: '',
			detail: {
				composition: '',
				usageText: '',
				dosage: '',
				targetUser: '',
				warning: '',
			},
			images: undefined,
		},
	});

	function onSubmit(values: z.infer<typeof CreateProductSchema>) {
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
			mutateAsync(fd, {
				onError: (error: any) => {
					toast.error(
						error?.message || 'Lỗi khi tạo sản phẩm. Vui lòng thử lại.',
					);
				},
			}).then(() => {
				form.reset();
				setFiles([]);
				setPreviewUrls([]);
				if (onSuccess) {
					onSuccess();
				}
			}),
			{
				pending: 'Đang tạo sản phẩm...',
				success: 'Đã tạo sản phẩm thành công',
			},
		);
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
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Chọn danh mục' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories?.map((category: Category) => (
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
					text='Thêm'
					isLoading={isPending}
					loadingText='Đang xử lý...'
				/>
			</form>
		</Form>
	);
}
