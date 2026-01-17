import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['vietnamese', 'latin'], // ensure Vietnamese characters are displayed correctly
	display: 'swap', // ensure font is loaded before rendering
});

export const fonts = { beVietnamPro };
