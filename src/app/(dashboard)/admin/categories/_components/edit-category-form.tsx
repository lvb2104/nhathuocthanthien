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
import { useUpdateCategory } from '@/hooks';
import { Category, UpdateCategoryRequest } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const updateCategorySchema = z.object({
	name: z.string().min(1, { message: 'Category name is required' }),
});

type EditCategoryFormProps = {
	category: Category;
	onSuccess?: () => void;
};

export default function EditCategoryForm({
	category,
	onSuccess,
}: EditCategoryFormProps) {
	const { mutateAsync, isPending } = useUpdateCategory();

	const form = useForm<UpdateCategoryRequest>({
		resolver: zodResolver(updateCategorySchema),
		defaultValues: {
			name: category.name,
		},
	});

	async function onSubmit(data: UpdateCategoryRequest) {
		try {
			await mutateAsync({ id: category.id, request: data });
			toast.success('Category updated successfully');
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Error updating category');
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
							<FormLabel>Category Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter category name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex justify-end gap-2'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Updating...' : 'Update'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
