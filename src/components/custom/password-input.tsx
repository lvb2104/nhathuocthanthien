import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import CustomInput from './custom-input';
import { Input } from '../ui/input';

export function PasswordInput({
	className,
	...props
}: React.ComponentProps<typeof Input>) {
	const [show, setShow] = useState(false);

	return (
		<div className='relative'>
			<CustomInput
				type={show ? 'text' : 'password'}
				{...props}
				className={`pr-10 ${className}`}
			/>
			<button
				type='button'
				onClick={() => setShow(s => !s)}
				className='cursor-pointer absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700'
				tabIndex={-1}
			>
				{show ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		</div>
	);
}
