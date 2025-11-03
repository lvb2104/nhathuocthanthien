'use client';
import LoadingScreen from '@/components/custom/loading-screen';
import ContentWrapper from '@/components/layouts/content-wrapper';
import { Suspense, useRef } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { Slider, sliders } from '@/lib/placeholder-data';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

function HomeContent() {
	return (
		<main className='my-2.5'>
			<ContentWrapper>
				{/* Hero section */}
				<div className='flex gap-2.5'>
					{/* Hero slider */}
					<Carousel
						opts={{ loop: true }}
						plugins={[Autoplay({ delay: 4000 })]}
						className='w-[793.338px]'
					>
						<CarouselContent>
							{sliders.map((slider: Slider, index) => (
								<CarouselItem key={index}>
									<a href={slider.linkUrl}>
										<div className='relative w-auto h-[400px]'>
											<Image
												src={slider.imageUrl}
												alt={`Slide ${index + 1}`}
												fill
											/>
										</div>
									</a>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className='rounded-[2px] w-[30px] h-[46px] left-0 border-none shadow-[6px_0_4px_rgb(0_0_0/5%),_4px_0_4px_rgb(0_0_0/9%)] bg-[#ffffff3d] cursor-pointer text-[#54aa00] hover:bg-[#ffffff3d] hover:text-[#7eff00]' />
						<CarouselNext className='rounded-[2px] w-[30px] h-[46px] right-0 border-none shadow-[-6px_0_4px_rgb(0_0_0/5%),_-4px_0_4px_rgb(0_0_0/9%)] bg-[#ffffff3d] cursor-pointer text-[#54aa00] hover:bg-[#ffffff3d] hover:text-[#7eff00]' />
					</Carousel>
					{/* Hero banner */}
					<div className='flex gap-2.5 flex-col'>
						<div className='relative w-auto h-[195px]'>
							<Image src='/placeholders/banner-1.jpg' alt='Banner 1' fill />
						</div>
						<div className='relative w-[400px] h-[195px]'>
							<Image src='/placeholders/banner-2.jpg' alt='Banner 2' fill />
						</div>
					</div>
				</div>
				{/* Featured products section */}
				<div></div>
			</ContentWrapper>
		</main>
	);
}

function HomePage() {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<HomeContent />
		</Suspense>
	);
}

export default HomePage;
