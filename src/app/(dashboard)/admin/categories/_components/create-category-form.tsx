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
import { useCreateCategory } from '@/hooks';
import { CreateCategoryRequest } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const createCategorySchema = z.object({
	name: z.string().min(1, { message: 'Vui lòng nhập tên danh mục' }),
});

type CreateCategoryFormProps = {
	onSuccess?: () => void;
};

export default function CreateCategoryForm({
	onSuccess,
}: CreateCategoryFormProps) {
	const { mutateAsync, isPending } = useCreateCategory();

	const form = useForm<CreateCategoryRequest>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: '',
		},
	});

	async function onSubmit(data: CreateCategoryRequest) {
		try {
			await mutateAsync(data);
			toast.success('Đã tạo danh mục thành công');
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Lỗi khi tạo danh mục');
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-6'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên danh mục *</FormLabel>
							<FormControl>
								<Input placeholder='Nhập tên danh mục' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex justify-end gap-2'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Đang tạo...' : 'Tạo danh mục'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
