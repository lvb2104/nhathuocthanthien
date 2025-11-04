function ContentWrapper({ children }: { children: React.ReactNode }) {
	return <div className='max-w-[1260px] mx-auto px-[30px]'>{children}</div>;
}

export default ContentWrapper;
