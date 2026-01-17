'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { useUpdateShippingAddress } from '@/hooks';
import { ShippingAddressSchema } from '@/schemas';
import { ShippingAddress } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Pencil } from 'lucide-react';

type EditAddressFormData = z.infer<typeof ShippingAddressSchema>;

type EditAddressDialogProps = {
	address: ShippingAddress;
};

export default function EditAddressDialog({ address }: EditAddressDialogProps) {
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending } = useUpdateShippingAddress();

	const form = useForm<EditAddressFormData>({
		resolver: zodResolver(ShippingAddressSchema),
		defaultValues: {
			fullName: address.fullName,
			phone: address.phone,
			addressLine: address.addressLine,
			ward: address.ward || '',
			district: address.district || '',
			province: address.province || '',
			note: address.note || '',
			isDefault: address.isDefault,
		},
	});

	// Reset form when dialog opens with new address data
	useEffect(() => {
		if (open) {
			form.reset({
				fullName: address.fullName,
				phone: address.phone,
				addressLine: address.addressLine,
				ward: address.ward || '',
				district: address.district || '',
				province: address.province || '',
				note: address.note || '',
				isDefault: address.isDefault,
			});
		}
	}, [open, address, form]);

	async function onSubmit(data: EditAddressFormData) {
		try {
			await mutateAsync({ id: address.id, data });
			toast.success('Cập nhật địa chỉ thành công');
			setOpen(false);
		} catch (error: any) {
			toast.error(error?.message || 'Không thể cập nhật địa chỉ');
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button
				variant='outline'
				size='sm'
				onClick={() => setOpen(true)}
				className='flex items-center gap-1'
			>
				<Pencil className='h-3 w-3' />
				Sửa
			</Button>

			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Chỉnh sửa địa chỉ giao hàng</DialogTitle>
					<DialogDescription>
						Cập nhật thông tin địa chỉ giao hàng của bạn
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
								{isPending ? 'Đang xử lý...' : 'Cập nhật'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
