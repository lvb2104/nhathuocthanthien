'use client';

import { useState, useRef } from 'react';
import { useCreatePrescription } from '@/hooks';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

type UploadPrescriptionDialogProps = {
	children: React.ReactNode;
};

export default function UploadPrescriptionDialog({
	children,
}: UploadPrescriptionDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const createPrescriptionMutation = useCreatePrescription();

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				toast.error('Vui lòng chọn file hình ảnh');
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error('Kích thước file không được vượt quá 5MB');
				return;
			}

			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleClearFile = () => {
		setSelectedFile(null);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSubmit = async () => {
		if (!selectedFile) {
			toast.error('Vui lòng chọn hình ảnh đơn thuốc');
			return;
		}

		const formData = new FormData();
		formData.append('file', selectedFile);

		try {
			await toast.promise(createPrescriptionMutation.mutateAsync(formData), {
				pending: 'Đang tải lên đơn thuốc...',
				success: 'Đơn thuốc đã được gửi thành công! 🎉',
				error: {
					render({ data }: any) {
						return (
							data?.response?.data?.message ||
							'Không thể tải lên đơn thuốc. Vui lòng thử lại.'
						);
					},
				},
			});

			// Reset and close
			handleClearFile();
			setOpen(false);
		} catch (error) {
			console.error('Upload prescription error:', error);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			handleClearFile();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<FileImage className='text-green-600' size={20} />
						Tải lên đơn thuốc
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					{/* Upload Area */}
					{!selectedFile ? (
						<div
							onClick={() => fileInputRef.current?.click()}
							className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors'
						>
							<Upload className='mx-auto text-gray-400 mb-3' size={40} />
							<p className='text-gray-600 mb-1'>
								Nhấn để chọn hình ảnh đơn thuốc
							</p>
							<p className='text-sm text-gray-400'>
								Hỗ trợ: JPG, PNG, WEBP (tối đa 5MB)
							</p>
						</div>
					) : (
						<div className='relative'>
							<div className='relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100'>
								<Image
									src={previewUrl!}
									alt='Prescription preview'
									fill
									className='object-contain'
								/>
							</div>
							<button
								onClick={handleClearFile}
								className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
							>
								<X size={16} />
							</button>
							<p className='mt-2 text-sm text-gray-600 truncate'>
								{selectedFile.name}
							</p>
						</div>
					)}

					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						onChange={handleFileSelect}
						className='hidden'
					/>

					{/* Actions */}
					<div className='flex gap-3'>
						<Button
							variant='outline'
							onClick={() => handleOpenChange(false)}
							className='flex-1'
						>
							Hủy
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={!selectedFile || createPrescriptionMutation.isPending}
							className='flex-1 bg-green-600 hover:bg-green-700'
						>
							{createPrescriptionMutation.isPending ? (
								<>
									<Loader2 className='animate-spin mr-2' size={16} />
									Đang gửi...
								</>
							) : (
								'Gửi đơn thuốc'
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
