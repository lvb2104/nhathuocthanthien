'use client';

import { useState, useEffect } from 'react';
import { Delivery, DeliveryStatus } from '@/types';
import { useUpdateDeliveryStatus } from '@/hooks';
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

interface UpdateDeliveryStatusDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	delivery: Delivery;
}

export function UpdateDeliveryStatusDialog({
	open,
	onOpenChange,
	delivery,
}: UpdateDeliveryStatusDialogProps) {
	const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus>(
		delivery.status,
	);
	const { mutateAsync, isPending } = useUpdateDeliveryStatus();

	// Reset form when dialog opens with new delivery
	useEffect(() => {
		if (open) {
			setSelectedStatus(delivery.status);
		}
	}, [open, delivery]);

	const handleSubmit = async () => {
		if (selectedStatus === delivery.status) {
			toast.info('Status is already set to this value');
			return;
		}

		toast.promise(
			mutateAsync({
				id: delivery.id,
				request: { status: selectedStatus },
			}).then(() => {
				onOpenChange(false);
			}),
			{
				pending: 'Updating delivery status...',
				success: 'Delivery status updated successfully',
				error: 'Error updating delivery status',
			},
		);
	};

	// Determine available statuses based on current status
	const getAvailableStatuses = () => {
		switch (delivery.status) {
			case DeliveryStatus.ASSIGNED:
				return [DeliveryStatus.ASSIGNED, DeliveryStatus.SHIPPING];
			case DeliveryStatus.SHIPPING:
				return [
					DeliveryStatus.SHIPPING,
					DeliveryStatus.DELIVERED,
					DeliveryStatus.CANCELLED,
				];
			case DeliveryStatus.DELIVERED:
			case DeliveryStatus.CANCELLED:
				return [delivery.status]; // Cannot change from these states
			default:
				return [delivery.status];
		}
	};

	const availableStatuses = getAvailableStatuses();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Update Delivery Status</DialogTitle>
					<DialogDescription>
						Update the status for delivery #{delivery.id} (Order #
						{delivery.orderId}).
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='status'>New Status</Label>
						<Select
							value={selectedStatus}
							onValueChange={setSelectedStatus as (value: string) => void}
						>
							<SelectTrigger id='status'>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								{availableStatuses.map(status => (
									<SelectItem key={status} value={status}>
										<span className='capitalize'>{status}</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className='text-xs text-muted-foreground'>
							{delivery.status === DeliveryStatus.ASSIGNED &&
								'You can mark this delivery as shipping once you start the delivery.'}
							{delivery.status === DeliveryStatus.SHIPPING &&
								'Mark as delivered when the package is handed to the customer, or cancel if needed.'}
							{(delivery.status === DeliveryStatus.DELIVERED ||
								delivery.status === DeliveryStatus.CANCELLED) &&
								'This delivery status cannot be changed.'}
						</p>
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
					<Button
						onClick={handleSubmit}
						disabled={
							isPending ||
							selectedStatus === delivery.status ||
							delivery.status === DeliveryStatus.DELIVERED ||
							delivery.status === DeliveryStatus.CANCELLED
						}
					>
						{isPending ? 'Updating...' : 'Update Status'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
