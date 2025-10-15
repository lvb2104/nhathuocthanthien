import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { useState } from 'react'

export function PasswordInput({
	className,
	...props
}: React.ComponentProps<typeof Input>) {
	const [show, setShow] = useState(false)

	return (
		<div className='relative'>
			<Input
				type={show ? 'text' : 'password'}
				{...props}
				className={`pr-10 ${className}`}
			/>
			<button
				type='button'
				onClick={() => setShow(s => !s)}
				className='absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700'
				tabIndex={-1}
			>
				{show ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		</div>
	)
}
