import React from 'react';
import Image from 'next/image';
import ContentWrapper from './ContentWrapper';

function Footer() {
	return (
		<footer className='bg-[#ebf8ed] pt-12 pb-6 text-[#808089]'>
			<ContentWrapper>
				<div className='grid grid-cols-13 gap-8 mb-8'>
					{/* About Us */}
					<div className='col-span-4'>
						<h3 className='font-bold mb-4'>Về chúng tôi</h3>
						<ul className='space-y-2 text-sm '>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Giới thiệu
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Liên hệ nhà thuốc
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Sơ đồ trang web
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Điều khoản sử dụng
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Khiếu nại chất lượng dịch vụ
								</a>
							</li>
							<li>
								<a href='#' className='font-semibold text-[#54AA00]'>
									Cách tra cứu thuốc đã cấp phép
								</a>
							</li>
						</ul>
					</div>

					{/* Customer Support */}
					<div className='col-span-2'>
						<h3 className='font-bold mb-4'>Hỗ trợ khách hàng</h3>
						<ul className='space-y-2 text-sm'>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Hướng dẫn mua hàng
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Chính sách giao hàng
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Chính sách đổi trả hàng
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Chính sách bảo hành
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Chính sách bảo mật
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-[#7AB02C]'>
									Chính sách bán quyền
								</a>
							</li>
						</ul>
					</div>

					{/* Certifications */}
					<div className='col-span-2'>
						<h3 className='font-bold mb-4'>Chứng nhận bởi</h3>
						<div className='space-y-3'>
							<Image
								src='/images/cer-1.jpg'
								alt='NCSC'
								width={120}
								height={30}
							/>
							<Image
								src='/images/cer-2.png'
								alt='DMCA Protected'
								width={120}
								height={30}
							/>
							<Image
								src='/images/cer-3.png'
								alt='Verified'
								width={120}
								height={30}
							/>
						</div>
					</div>

					{/* Disclaimer */}
					<div className='col-span-3'>
						<h3 className='font-bold mb-4'>Miễn trừ trách nhiệm</h3>
						<p className='text-sm leading-relaxed'>
							Nội dung chia sẻ chỉ mang tính chất tham khảo, không được lý ý áp
							dụng khi chưa có tư vấn chuyên môn. Vui lòng liên hệ Dược sĩ để
							được tư vấn,
							<br />
							<a href='#' className='text-[#54AA00]'>
								Click xem chi tiết
							</a>
						</p>
					</div>

					{/* Shipping Services */}
					<div className='col-span-2'>
						<h3 className='font-bold mb-4'>Dịch vụ vận chuyển</h3>
						<div className='space-y-3'>
							<Image
								src='/images/partner-1.png'
								alt='GHTK'
								className='border rounded'
								width={120}
								height={30}
							/>
							<Image
								src='/images/partner-2.png'
								alt='GHN'
								className='border rounded'
								width={120}
								height={30}
							/>
							<Image
								src='/images/partner-3.png'
								alt='Viettel Post'
								className='border rounded'
								width={120}
								height={30}
							/>
							<Image
								src='/images/partner-4.png'
								alt='AhaMove'
								className='border rounded'
								width={120}
								height={30}
							/>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='border-t pt-6 text-center'>
					<p className='text-xs leading-relaxed mb-4'>
						© Copyright 2025 Hộ kinh doanh Nhà Thuốc Thân Thiện Số ĐKKD
						01G8037498 & 01G8024000 cấp tại Phòng Tài Chính - Kế Hoạch Hồ Chí
						Minh. Địa chỉ: Số 82 Thủ Đức, TP. Hồ Chí Minh & Số 10 ngõ 68/39 Cầu
						Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội. Số điện thoại:{' '}
						<span className='font-bold'>0987654321</span> - Email:{' '}
						<span className='font-bold'>nhathuocthanthien@gmail.com</span> -
						Người quản lý nội dung: Lê Văn Bảo & Nguyễn Bá Tuấn Anh
					</p>
					<div className='flex items-center justify-center gap-4 text-[#54AA00]'>
						<a href='#' className='hover:text-[#7AB02C]'>
							<svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
								<path d='M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z' />
							</svg>
						</a>
						<a href='#' className='hover:text-[#7AB02C]'>
							<svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
								<path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' />
							</svg>
						</a>
						<a href='#' className='hover:text-[#7AB02C]'>
							<svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
								<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
							</svg>
						</a>
						<a href='#' className='hover:text-[#7AB02C]'>
							<svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
								<path d='M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
							</svg>
						</a>
					</div>
				</div>
			</ContentWrapper>
		</footer>
	);
}

export default Footer;
