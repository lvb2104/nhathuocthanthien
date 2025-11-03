'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function ScrollToTop() {
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};
		window.addEventListener('scroll', toggleVisibility);

		return () => window.removeEventListener('scroll', toggleVisibility);
	}, []);
	return (
		<button
			onClick={scrollToTop}
			className={`fixed right-[4px] bottom-[120px] z-99 text-center bg-(--primary-color) text-[30px] cursor-pointer rounded-full p-2 hover:bg-[#469900] transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
		>
			<Image
				src='/icons/move-button.svg'
				alt='Move to top'
				width={15}
				height={15}
				className='h-[15px] w-[15px]'
			/>
		</button>
	);
}

export default ScrollToTop;
