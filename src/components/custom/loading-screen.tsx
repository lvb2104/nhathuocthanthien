import React from 'react';
import { Spinner } from '../ui/spinner';

function LoadingScreen() {
	return (
		<div className='h-screen flex items-center justify-center'>
			<Spinner className='size-8 text-(--primary-color)' />
		</div>
	);
}

export default LoadingScreen;
