import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

function LoadingButton({
	isLoading,
	loadingText = 'Đang xử lý...',
	text,
	...props
}: {
	isLoading: boolean;
	loadingText?: string;
	text: string;
	props?: any;
}) {
	return (
		<div className='flex justify-center py-4'>
			<Button
				disabled={isLoading}
				className='w-[40%] bg-[#189dfe] hover:bg-(--primary-color) px-6 py-3 text-white rounded-lg font-semibold transition'
				{...props}
			>
				{isLoading ? <Spinner /> : null}
				{isLoading ? loadingText : text}
			</Button>
		</div>
	);
}

export default LoadingButton;
