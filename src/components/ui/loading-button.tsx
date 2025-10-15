import React from 'react'
import { Button } from './button'

function LoadingButton({
	isLoading,
	text,
}: {
	isLoading: boolean
	text: string
}) {
	return (
		<div className='flex justify-center py-4'>
			<Button
				disabled={isLoading}
				className='w-[40%] bg-[#189dfe] hover:bg-[#54aa00] px-6 py-3 text-white rounded-lg font-semibold transition'
			>
				{isLoading ? 'Đang xử lý...' : text}
			</Button>
		</div>
	)
}

export default LoadingButton
