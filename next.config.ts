import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: 'ih1.redbubble.net',
			},
			{
				protocol: 'https',
				hostname: 'nhathuocthanthien.com.vn',
			},
		],
	},
};

export default nextConfig;
