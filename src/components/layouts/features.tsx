import { Clock, RefreshCw, Truck } from 'lucide-react';
import ContentWrapper from './content-wrapper';

function Features() {
	return (
		<section className='bg-gradient-to-b from-green-50 to-white py-8 mt-16'>
			<ContentWrapper>
				<div className='container mx-auto px-6'>
					<div className='grid grid-cols-4 gap-6'>
						<div className='flex items-center gap-4'>
							<div className='bg-[#7AB02C] p-4 rounded-full'>
								<svg
									className='w-8 h-8 text-white'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
								</svg>
							</div>
							<div>
								<div className='font-bold text-[#7AB02C]'>
									Thân thiện cam kết
								</div>
								<div className='text-sm text-gray-600'>chất lượng sản phẩm</div>
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<div className='bg-[#7AB02C] p-4 rounded-full'>
								<Truck className='w-8 h-8 text-white' />
							</div>
							<div>
								<div className='font-bold text-[#7AB02C]'>
									Miễn phí vận chuyển
								</div>
								<div className='text-sm text-gray-600'>
									theo chính sách giao hàng
								</div>
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<div className='bg-[#7AB02C] p-4 rounded-full'>
								<Clock className='w-8 h-8 text-white' />
							</div>
							<div>
								<div className='font-bold text-[#7AB02C]'>Giao nhanh 2 giờ</div>
								<div className='text-sm text-gray-600'>
									chỉ áp dụng ở Hồ Chí Minh
								</div>
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<div className='bg-[#7AB02C] p-4 rounded-full'>
								<RefreshCw className='w-8 h-8 text-white' />
							</div>
							<div>
								<div className='font-bold text-[#7AB02C]'>Đổi trả 30 ngày</div>
								<div className='text-sm text-gray-600'>kể từ ngày mua hàng</div>
							</div>
						</div>
					</div>
				</div>
			</ContentWrapper>
		</section>
	);
}

export default Features;
