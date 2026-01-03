import { OrderStatus, PaymentStatus } from '@/types';

// Status badge configuration
export function getOrderStatusConfig(status: OrderStatus) {
	const configs = {
		[OrderStatus.PENDING]: {
			variant: 'outline' as const,
			className: 'bg-yellow-50 text-yellow-700 border-yellow-300',
			label: 'Chờ xác nhận',
		},
		[OrderStatus.CONFIRMED]: {
			variant: 'outline' as const,
			className: 'bg-blue-50 text-blue-700 border-blue-300',
			label: 'Đã xác nhận',
		},
		[OrderStatus.SHIPPED]: {
			variant: 'outline' as const,
			className: 'bg-purple-50 text-purple-700 border-purple-300',
			label: 'Đang giao',
		},
		[OrderStatus.DELIVERED]: {
			variant: 'outline' as const,
			className: 'bg-green-50 text-green-700 border-green-300',
			label: 'Hoàn thành',
		},
		[OrderStatus.CANCELLED]: {
			variant: 'outline' as const,
			className: 'bg-red-50 text-red-700 border-red-300',
			label: 'Đã hủy',
		},
	};

	return configs[status];
}

export function getPaymentStatusConfig(status: PaymentStatus) {
	const configs = {
		[PaymentStatus.PENDING]: {
			variant: 'outline' as const,
			className: 'bg-yellow-50 text-yellow-700 border-yellow-300',
			label: 'Chờ thanh toán',
		},
		[PaymentStatus.PAID]: {
			variant: 'outline' as const,
			className: 'bg-green-50 text-green-700 border-green-300',
			label: 'Đã thanh toán',
		},
		[PaymentStatus.FAILED]: {
			variant: 'outline' as const,
			className: 'bg-red-50 text-red-700 border-red-300',
			label: 'Thanh toán thất bại',
		},
		[PaymentStatus.REFUNDED]: {
			variant: 'outline' as const,
			className: 'bg-gray-50 text-gray-700 border-gray-300',
			label: 'Đã hoàn tiền',
		},
	};

	return configs[status];
}

export function formatOrderDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function formatCurrency(amount: string | number): string {
	const numAmount = typeof amount === 'string' ? Number(amount) : amount;
	return numAmount.toLocaleString('vi-VN') + 'đ';
}
