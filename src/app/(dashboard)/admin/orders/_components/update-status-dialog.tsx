'use client';

import { useState } from 'react';
import { OrderStatus } from '@/types';
import { useUpdateOrderStatus } from '@/hooks';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

interface UpdateStatusDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	orderId: number;
	currentStatus: OrderStatus;
	onSuccess?: () => void;
}

export function UpdateStatusDialog({
	open,
	onOpenChange,
	orderId,
	currentStatus,
	onSuccess,
}: UpdateStatusDialogProps) {
	const [selectedStatus, setSelectedStatus] =
		useState<OrderStatus>(currentStatus);
	const { mutateAsync, isPending } = useUpdateOrderStatus();

	const handleSubmit = async () => {
		if (selectedStatus === currentStatus) {
			toast.info('Please select a different status');
			return;
		}

		toast.promise(
			mutateAsync({
				id: orderId,
				request: { status: selectedStatus },
			}).then(() => {
				onSuccess?.();
			}),
			{
				pending: 'Updating order status...',
				success: 'Order status updated successfully',
				error: 'Error updating order status',
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Update Order Status</DialogTitle>
					<DialogDescription>
						Change the status of order #{orderId}. Click save when you&apos;re
						done.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='status'>Order Status</Label>
						<Select
							value={selectedStatus}
							onValueChange={value => setSelectedStatus(value as OrderStatus)}
						>
							<SelectTrigger id='status'>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
								<SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
								<SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
								<SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
								<SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isPending}>
						{isPending ? 'Updating...' : 'Save Changes'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
