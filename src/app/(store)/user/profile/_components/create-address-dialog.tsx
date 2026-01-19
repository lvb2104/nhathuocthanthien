'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateShippingAddress, useShippingAddresses } from '@/hooks';
import { ShippingAddressSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

type CreateAddressFormData = z.infer<typeof ShippingAddressSchema>;

export default function CreateAddressDialog() {
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending } = useCreateShippingAddress();
	const { data: existingAddresses } = useShippingAddresses();

	// Check if this will be the first address
	const isFirstAddress = !existingAddresses || existingAddresses.length === 0;

	const form = useForm<CreateAddressFormData>({
		resolver: zodResolver(ShippingAddressSchema),
		defaultValues: {
			fullName: '',
			phone: '',
			addressLine: '',
			ward: '',
			district: '',
			province: '',
			note: '',
			isDefault: false,
		},
	});

	// Auto-set isDefault to true when this is the first address
	useEffect(() => {
		if (open && isFirstAddress) {
			form.setValue('isDefault', true);
		}
	}, [open, isFirstAddress, form]);

	async function onSubmit(data: CreateAddressFormData) {
		try {
			await mutateAsync(data);
			toast.success('Thêm địa chỉ mới thành công');
			form.reset();
			setOpen(false);
		} catch (error: any) {
			toast.error(error?.message || 'Không thể thêm địa chỉ');
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='flex items-center gap-2'>
					<Plus className='h-4 w-4' />
					Thêm địa chỉ mới
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Thêm địa chỉ giao hàng mới</DialogTitle>
					<DialogDescription>
						Điền thông tin địa chỉ giao hàng của bạn
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='fullName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Họ và tên *</FormLabel>
										<FormControl>
											<Input placeholder='Nguyễn Văn A' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Số điện thoại *</FormLabel>
										<FormControl>
											<Input type='tel' placeholder='0123456789' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<FormField
								control={form.control}
								name='province'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tỉnh/Thành phố</FormLabel>
										<FormControl>
											<Input placeholder='Hồ Chí Minh' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='district'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quận/Huyện</FormLabel>
										<FormControl>
											<Input placeholder='Quận 1' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='ward'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phường/Xã</FormLabel>
										<FormControl>
											<Input placeholder='Phường Bến Nghé' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='addressLine'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Địa chỉ cụ thể *</FormLabel>
									<FormControl>
										<Input placeholder='123 Đường Lê Lợi' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='note'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ghi chú</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Ghi chú thêm về địa chỉ (tùy chọn)'
											rows={3}
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
							name='isDefault'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
									</div>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => setOpen(false)}
								disabled={isPending}
							>
								Hủy
							</Button>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Đang xử lý...' : 'Thêm địa chỉ'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
