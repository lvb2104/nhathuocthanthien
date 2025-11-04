import { Spinner } from '@/components/ui/spinner';

function Loading() {
	return (
		<div className='h-screen flex items-center justify-center'>
			<Spinner className='size-8 text-(--primary-color)' />
		</div>
	);
}

export default Loading;
