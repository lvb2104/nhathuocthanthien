import React from 'react'
import { Input } from '../ui/input'

function CustomInput(props: React.ComponentProps<typeof Input>) {
	return <Input {...props} className='focus-visible:ring-0' />
}

export default CustomInput
