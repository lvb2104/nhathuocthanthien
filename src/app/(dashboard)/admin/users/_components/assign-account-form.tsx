'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAssignAccount } from '@/hooks';
import { AssignAccountRequest } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const assignAccountSchema = z
	.object({
		fullName: z.string().min(1, { message: 'Full name is required' }),
		email: z.string().email({ message: 'Invalid email address' }),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters' }),
		phone: z.string().optional(),
		roleId: z.number({ message: 'Role is required' }),
		hireDate: z.string().optional(),
		licenseNumber: z.string().optional(),
	})
	.refine(
		data => {
			// Employee (roleId 4) or Pharmacist (roleId 3) require hireDate
			if (data.roleId === 3 || data.roleId === 4) {
				return !!data.hireDate;
			}
			return true;
		},
		{
			message: 'Hire date is required for Employee and Pharmacist roles',
			path: ['hireDate'],
		},
	)
	.refine(
		data => {
			// Pharmacist (roleId 3) requires licenseNumber
			if (data.roleId === 3) {
				return !!data.licenseNumber;
			}
			return true;
		},
		{
			message: 'License number is required for Pharmacist role',
			path: ['licenseNumber'],
		},
	);

type AssignAccountFormProps = {
	onSuccess?: () => void;
};

export default function AssignAccountForm({
	onSuccess,
}: AssignAccountFormProps) {
	const { mutateAsync, isPending } = useAssignAccount();

	const form = useForm<AssignAccountRequest>({
		resolver: zodResolver(assignAccountSchema),
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
			phone: '',
			roleId: undefined,
			hireDate: undefined,
			licenseNumber: undefined,
		},
	});

	const selectedRole = form.watch('roleId');
	const showHireDate = selectedRole === 3 || selectedRole === 4; // Pharmacist or Employee
	const showLicenseNumber = selectedRole === 3; // Pharmacist only

	async function onSubmit(data: AssignAccountRequest) {
		try {
			await mutateAsync(data);
			toast.success('User account created successfully');
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || 'Error creating user account');
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-6'>
				<FormField
					control={form.control}
					name='fullName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name *</FormLabel>
							<FormControl>
								<Input placeholder='Enter full name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email *</FormLabel>
							<FormControl>
								<Input type='email' placeholder='Enter email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password *</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Enter password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='phone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input placeholder='Enter phone number' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='roleId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role *</FormLabel>
							<Select
								onValueChange={value => field.onChange(Number(value))}
								value={field.value?.toString()}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a role' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='1'>Customer</SelectItem>
									<SelectItem value='2'>Admin</SelectItem>
									<SelectItem value='3'>Pharmacist</SelectItem>
									<SelectItem value='4'>Employee</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{showHireDate && (
					<FormField
						control={form.control}
						name='hireDate'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Hire Date *</FormLabel>
								<FormControl>
									<Input type='date' {...field} value={field.value || ''} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{showLicenseNumber && (
					<FormField
						control={form.control}
						name='licenseNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>License Number *</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter license number'
										{...field}
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<div className='flex justify-end gap-2'>
					<Button type='submit' disabled={isPending}>
						{isPending ? 'Creating...' : 'Create Account'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
