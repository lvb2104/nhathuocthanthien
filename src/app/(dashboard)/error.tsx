'use client';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		toast.info(error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
	}, [error]);

	return (
		<div>
			<h2>Lỗi xảy ra!</h2>
			<button onClick={() => reset()}>Thử lại</button>
		</div>
	);
}
