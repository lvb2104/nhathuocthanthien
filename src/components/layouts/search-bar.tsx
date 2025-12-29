'use client';
import { useDebounce } from '@/hooks';
import { useProducts } from '@/hooks';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { app } from '@/configs/app';

function SearchBar() {
	const [searchTerm, setSearchTerm] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const debouncedSearchTerm = useDebounce(searchTerm, 300);
	const router = useRouter();
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Fetch products based on debounced search term
	const { data: response, isFetching } = useProducts(
		debouncedSearchTerm.trim()
			? { keyword: debouncedSearchTerm, limit: 10 }
			: undefined,
	);

	const products = response?.data || [];

	// Handle click outside to close dropdown
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Show dropdown when there are products and search term
	useEffect(() => {
		if (debouncedSearchTerm.trim() && products.length > 0) {
			setIsOpen(true);
			setSelectedIndex(-1);
		} else if (!debouncedSearchTerm.trim()) {
			setIsOpen(false);
		}
	}, [debouncedSearchTerm, products.length]);

	// Handle keyboard navigation
	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (!isOpen) {
			if (e.key === 'Enter' && searchTerm.trim()) {
				handleSearch();
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex(prev =>
					prev < products.length - 1 ? prev + 1 : prev,
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0 && products[selectedIndex]) {
					handleProductClick(products[selectedIndex].id);
				} else if (searchTerm.trim()) {
					handleSearch();
				}
				break;
			case 'Escape':
				e.preventDefault();
				setIsOpen(false);
				setSelectedIndex(-1);
				break;
		}
	}

	function handleProductClick(productId: number) {
		setIsOpen(false);
		setSearchTerm('');
		setSelectedIndex(-1);
		router.push(`/products/${productId}`);
	}

	function handleSearch() {
		if (!searchTerm.trim()) return;
		setIsOpen(false);
		setSelectedIndex(-1);
		router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
	}

	function handleClear() {
		setSearchTerm('');
		setIsOpen(false);
		setSelectedIndex(-1);
		inputRef.current?.focus();
	}

	return (
		<div className='flex-1 max-w-xl relative' ref={searchRef}>
			<div className='relative'>
				<input
					ref={inputRef}
					type='text'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder='Tìm sản phẩm...'
					className='w-full h-10 px-4 py-3 rounded-full pr-24 text-gray-700 bg-white border-none outline-none'
				/>
				<div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1'>
					{searchTerm && (
						<button
							onClick={handleClear}
							className='p-1.5 rounded-full hover:bg-gray-100 transition-colors'
							type='button'
							aria-label='Clear search'
						>
							<X className='w-4 h-4 text-gray-600' />
						</button>
					)}
					<button
						onClick={handleSearch}
						className='bg-white p-2 rounded-full hover:bg-gray-100 transition-colors'
						type='button'
						aria-label='Search'
					>
						<Search className='w-5 h-5 text-gray-600' />
					</button>
				</div>
			</div>

			{/* Autocomplete Dropdown */}
			{isOpen && products.length > 0 && (
				<div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50'>
					{products.map((product, index) => (
						<button
							key={product.id}
							onClick={() => handleProductClick(product.id)}
							className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left ${
								index === selectedIndex ? 'bg-gray-50' : ''
							}`}
							type='button'
						>
							{/* Product Image */}
							<div className='relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden'>
								<Image
									src={product.images[0]?.imageUrl || app.DEFAULT_IMAGE_URL}
									alt={product.name}
									fill
									className='object-contain p-1'
								/>
							</div>

							{/* Product Info */}
							<div className='flex-1 min-w-0'>
								<h4 className='text-sm font-semibold text-gray-900 line-clamp-2 mb-1'>
									{product.name}
								</h4>
								{product.description && (
									<p className='text-xs text-gray-500 line-clamp-1 mb-1'>
										{product.description}
									</p>
								)}
								<p className='text-sm font-semibold text-red-600'>
									{Number(product.price).toLocaleString('vi-VN')}đ
								</p>
							</div>
						</button>
					))}
				</div>
			)}

			{/* Loading indicator */}
			{isFetching && debouncedSearchTerm.trim() && (
				<div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-sm text-gray-500 z-50'>
					Đang tìm kiếm...
				</div>
			)}

			{/* No results */}
			{!isFetching &&
				debouncedSearchTerm.trim() &&
				products.length === 0 &&
				isOpen && (
					<div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-sm text-gray-500 z-50'>
						Không tìm thấy sản phẩm nào
					</div>
				)}
		</div>
	);
}

export default SearchBar;
