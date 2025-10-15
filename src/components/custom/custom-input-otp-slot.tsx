import React from 'react'
import { InputOTPSlot } from '../ui/input-otp'

function CustomInputOTPSlot(props: React.ComponentProps<typeof InputOTPSlot>) {
	return <InputOTPSlot {...props} className='data-[active=true]:ring-0' />
}

export default CustomInputOTPSlot
