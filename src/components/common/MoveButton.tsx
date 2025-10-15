'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import moveButton from '@/assets/icons/move-button.svg'

function MoveButton() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const [isVisible, setIsVisible] = React.useState(false)

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true)
			} else {
				setIsVisible(false)
			}
		}

		window.addEventListener('scroll', toggleVisibility)

		return () => window.removeEventListener('scroll', toggleVisibility)
	}, [])
	return (
		<button
			onClick={scrollToTop}
			className={`fixed right-[4px] bottom-[120px] z-99 text-center bg-[#54aa00] text-[30px] cursor-pointer rounded-full p-2 hover:bg-[#469900] transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
		>
			<Image
				src={moveButton}
				alt='Move to top'
				width={15}
				height={15}
				className='h-[15px] w-[15px]'
			/>
		</button>
	)
}

export default MoveButton
