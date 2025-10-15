import React from 'react'
import { PasswordInput } from './password-input'

function CustomPasswordInput(
	props: React.ComponentProps<typeof PasswordInput>,
) {
	return <PasswordInput {...props} className='focus-visible:ring-0' />
}

export default CustomPasswordInput
