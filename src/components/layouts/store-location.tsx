import ContentWrapper from './content-wrapper';

function StoreLocation() {
	return (
		<section className='bg-[#7AB02C] py-4'>
			<ContentWrapper>
				<div className='container mx-auto px-6 flex items-center justify-between'>
					<div className='flex items-center gap-3 text-white'>
						<svg className='w-8 h-8' fill='currentColor' viewBox='0 0 24 24'>
							<path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' />
						</svg>
						<span className='text-xl font-semibold'>Tìm cửa hàng gần bạn</span>
					</div>
					<button className='bg-white text-[#7AB02C] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition cursor-pointer'>
						Xem hệ thống cửa hàng
					</button>
				</div>
			</ContentWrapper>
		</section>
	);
}

export default StoreLocation;
