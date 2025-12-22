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
	name: z.string().min(1, { message: 'Category name is required' }),
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
			toast.success('Category created successfully');
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Error creating category');
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
						{isPending ? 'Creating...' : 'Create Category'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
