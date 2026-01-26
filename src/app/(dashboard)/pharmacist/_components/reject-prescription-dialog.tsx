'use client';

import { Prescription } from '@/types';
import { useRejectPrescription } from '@/hooks';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { AlertTriangle } from 'lucide-react';

interface RejectPrescriptionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	prescription: Prescription;
}

export function RejectPrescriptionDialog({
	open,
	onOpenChange,
	prescription,
}: RejectPrescriptionDialogProps) {
	const { mutateAsync, isPending } = useRejectPrescription();

	const handleReject = async () => {
		toast.promise(
			mutateAsync(prescription.id).then(() => {
				onOpenChange(false);
			}),
			{
				pending: 'Đang từ chối đơn thuốc...',
				success: 'Đã từ chối đơn thuốc thành công',
				error: 'Lỗi khi từ chối đơn thuốc',
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<AlertTriangle className='size-5 text-destructive' />
						Từ chối đơn thuốc
					</DialogTitle>
					<DialogDescription>
						Bạn có chắc chắn muốn từ chối đơn thuốc #{prescription.id} của bệnh
						nhân <strong>{prescription.user?.fullName}</strong>?
					</DialogDescription>
				</DialogHeader>

				<div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
					<p>
						⚠️ Hành động này không thể hoàn tác. Đơn thuốc sẽ bị đánh dấu là đã
						từ chối.
					</p>
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
						variant='destructive'
						onClick={handleReject}
						disabled={isPending}
					>
						{isPending ? 'Đang xử lý...' : 'Xác nhận từ chối'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
