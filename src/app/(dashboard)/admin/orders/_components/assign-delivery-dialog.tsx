'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { useCreateDelivery, useUsers } from '@/hooks';
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

interface AssignDeliveryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	orderId: number;
	onSuccess?: () => void;
}

export function AssignDeliveryDialog({
	open,
	onOpenChange,
	orderId,
	onSuccess,
}: AssignDeliveryDialogProps) {
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
	const { mutateAsync, isPending } = useCreateDelivery();

	// Fetch employees (role: employee or pharmacist)
	const { data: employeesResponse, isLoading: isLoadingEmployees } = useUsers({
		role: UserRole.EMPLOYEE,
		limit: 100, // Get all employees
	});

	const employees = employeesResponse?.data || [];

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			setSelectedEmployeeId('');
		}
	}, [open]);

	const handleSubmit = async () => {
		if (!selectedEmployeeId) {
			toast.error('Please select an employee');
			return;
		}

		toast.promise(
			mutateAsync({
				orderId,
				employeeId: Number(selectedEmployeeId),
			}).then(() => {
				onSuccess?.();
				onOpenChange(false);
			}),
			{
				pending: 'Assigning delivery...',
				success: 'Delivery assigned successfully',
				error: 'Error assigning delivery',
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Assign Delivery</DialogTitle>
					<DialogDescription>
						Assign an employee to deliver order #{orderId}.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='employee'>Employee</Label>
						{isLoadingEmployees ? (
							<div className='text-sm text-muted-foreground'>
								Loading employees...
							</div>
						) : (
							<Select
								value={selectedEmployeeId}
								onValueChange={setSelectedEmployeeId}
							>
								<SelectTrigger id='employee'>
									<SelectValue placeholder='Select employee' />
								</SelectTrigger>
								<SelectContent>
									{employees.map(employee => (
										<SelectItem
											key={employee.id}
											value={employee.id.toString()}
										>
											{employee.fullName} ({employee.email})
										</SelectItem>
									))}
									{employees.length === 0 && (
										<div className='p-2 text-center text-sm text-muted-foreground'>
											No employees available
										</div>
									)}
								</SelectContent>
							</Select>
						)}
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
						{isPending ? 'Assigning...' : 'Assign Delivery'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
