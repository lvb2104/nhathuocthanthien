'use client';

import { useOrder } from '@/hooks';
import OrderDetailSheet from '@/app/(store)/user/orders/_components/order-detail-sheet';

interface OrderDetailWrapperProps {
	orderId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function OrderDetailWrapper({
	orderId,
	open,
	onOpenChange,
}: OrderDetailWrapperProps) {
	const { data: order, isPending } = useOrder(orderId);

	if (isPending || !order) {
		return null;
	}

	return (
		<OrderDetailSheet order={order} open={open} onOpenChange={onOpenChange} />
	);
}
