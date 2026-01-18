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
			toast.info('Vui lòng chọn một trạng thái khác');
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
				pending: 'Đang cập nhật trạng thái đơn hàng...',
				success: 'Đã cập nhật trạng thái đơn hàng thành công',
				error: 'Lỗi khi cập nhật trạng thái đơn hàng',
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
					<DialogDescription>
						Thay đổi trạng thái của đơn hàng #{orderId}. Nhấn lưu khi bạn hoàn
						tất.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='status'>Trạng thái đơn hàng</Label>
						<Select
							value={selectedStatus}
							onValueChange={value => setSelectedStatus(value as OrderStatus)}
						>
							<SelectTrigger id='status'>
								<SelectValue placeholder='Chọn trạng thái' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={OrderStatus.PENDING}>Chờ xử lý</SelectItem>
								<SelectItem value={OrderStatus.CONFIRMED}>
									Đã xác nhận
								</SelectItem>
								<SelectItem value={OrderStatus.SHIPPED}>
									Đang giao hàng
								</SelectItem>
								<SelectItem value={OrderStatus.DELIVERED}>
									Đã giao hàng
								</SelectItem>
								<SelectItem value={OrderStatus.CANCELLED}>Đã hủy</SelectItem>
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
						Hủy
					</Button>
					<Button onClick={handleSubmit} disabled={isPending}>
						{isPending ? 'Đang cập nhật...' : 'Lưu thay đổi'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
