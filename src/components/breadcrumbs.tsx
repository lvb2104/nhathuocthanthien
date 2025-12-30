import Link from 'next/link';

type BreadcrumbItem = {
	label: string;
	href: string;
};

type BreadcrumbsProps = {
	items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<nav className='mb-6 flex items-center gap-2 text-sm'>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;
				const isFirst = index === 0;

				return (
					<div key={item.href} className='flex items-center gap-2'>
						{index > 0 && (
							<svg
								className='h-4 w-4 text-neutral-400'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5l7 7-7 7'
								/>
							</svg>
						)}

						{isLast ? (
							<span className='font-medium text-neutral-900'>{item.label}</span>
						) : (
							<Link
								href={item.href}
								className={`cursor-pointer flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-green-600 ${isFirst ? 'flex items-center gap-1.5' : ''}`}
							>
								{isFirst && (
									<svg
										className='h-4 w-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
										/>
									</svg>
								)}
								<span>{item.label}</span>
							</Link>
						)}
					</div>
				);
			})}
		</nav>
	);
}
