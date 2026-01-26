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
			toast.info('Trạng thái đã được thiết lập giá trị này');
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
				pending: 'Đang cập nhật trạng thái giao hàng...',
				success: 'Cập nhật trạng thái giao hàng thành công',
				error: 'Lỗi khi cập nhật trạng thái giao hàng',
			},
		);
	};

	// Determine available statuses based on current status
	const getAvailableStatuses = () => {
		switch (delivery.status) {
			case DeliveryStatus.ASSIGNED:
				return [DeliveryStatus.SHIPPING];
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

	const getStatusLabel = (status: DeliveryStatus) => {
		switch (status) {
			case DeliveryStatus.ASSIGNED:
				return 'Đã phân công';
			case DeliveryStatus.SHIPPING:
				return 'Đang giao hàng';
			case DeliveryStatus.DELIVERED:
				return 'Đã giao hàng';
			case DeliveryStatus.CANCELLED:
				return 'Đã hủy';
			default:
				return status;
		}
	};

	const availableStatuses = getAvailableStatuses();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Cập nhật trạng thái giao hàng</DialogTitle>
					<DialogDescription>
						Cập nhật trạng thái cho chuyến giao hàng #{delivery.id} (Đơn hàng #
						{delivery.orderId}).
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='status'>Trạng thái mới</Label>
						<Select
							value={selectedStatus}
							onValueChange={setSelectedStatus as (value: string) => void}
						>
							<SelectTrigger id='status'>
								<SelectValue placeholder='Chọn trạng thái' />
							</SelectTrigger>
							<SelectContent>
								{availableStatuses.map(status => (
									<SelectItem key={status} value={status}>
										<span>{getStatusLabel(status)}</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className='text-xs text-muted-foreground'>
							{delivery.status === DeliveryStatus.ASSIGNED &&
								'Bạn có thể đánh dấu là đang giao hàng khi bắt đầu chuyến đi.'}
							{delivery.status === DeliveryStatus.SHIPPING &&
								'Đánh dấu đã giao hàng khi kiện hàng đã đến tay khách hàng, hoặc hủy nếu cần.'}
							{(delivery.status === DeliveryStatus.DELIVERED ||
								delivery.status === DeliveryStatus.CANCELLED) &&
								'Trạng thái giao hàng này không thể thay đổi.'}
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Hủy
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
						{isPending ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
