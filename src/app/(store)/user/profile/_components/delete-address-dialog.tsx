'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteShippingAddress } from '@/hooks';
import { ShippingAddress } from '@/types';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

type DeleteAddressDialogProps = {
	address: ShippingAddress;
};

export default function DeleteAddressDialog({
	address,
}: DeleteAddressDialogProps) {
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending } = useDeleteShippingAddress();

	async function handleDelete() {
		try {
			await mutateAsync(address.id);
			toast.success('Xóa địa chỉ thành công');
			setOpen(false);
		} catch (error: any) {
			toast.error(error?.message || 'Không thể xóa địa chỉ');
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<Button
				variant='destructive'
				size='sm'
				onClick={() => setOpen(true)}
				className='flex items-center gap-1'
			>
				<Trash2 className='h-3 w-3' />
				Xóa
			</Button>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Xác nhận xóa địa chỉ</AlertDialogTitle>
					<AlertDialogDescription className='space-y-2'>
						<p>Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
						<div className='bg-muted p-3 rounded-md text-sm space-y-1'>
							<p className='font-semibold text-foreground'>
								{address.fullName}
							</p>
							<p>{address.phone}</p>
							<p>
								{address.addressLine}
								{address.ward && `, ${address.ward}`}
								{address.district && `, ${address.district}`}
								{address.province && `, ${address.province}`}
							</p>
						</div>
						<p className='text-destructive'>
							Hành động này không thể hoàn tác.
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isPending}
						className='bg-destructive hover:bg-destructive/90'
					>
						{isPending ? 'Đang xóa...' : 'Xóa địa chỉ'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
