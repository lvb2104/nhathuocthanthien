import { PrescriptionStatus } from '@/types';

// Status badge configuration
export function getPrescriptionStatusConfig(status: PrescriptionStatus) {
	const configs = {
		[PrescriptionStatus.PENDING]: {
			variant: 'outline' as const,
			className: 'bg-yellow-50 text-yellow-700 border-yellow-300',
			label: 'Chờ duyệt',
		},
		[PrescriptionStatus.APPROVED]: {
			variant: 'outline' as const,
			className: 'bg-green-50 text-green-700 border-green-300',
			label: 'Đã duyệt',
		},
		[PrescriptionStatus.REJECTED]: {
			variant: 'outline' as const,
			className: 'bg-red-50 text-red-700 border-red-300',
			label: 'Từ chối',
		},
	};

	return configs[status];
}

export function formatPrescriptionDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}
