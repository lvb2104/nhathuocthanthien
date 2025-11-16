import z from 'zod';
import { CategoryResponse } from '.';

// validation Schemas
export const ProductDetailSchema = z.object({
	composition: z.string().optional(),
	usageText: z.string().optional(),
	dosage: z.string().optional(),
	targetUser: z.string().optional(),
	warning: z.string().optional(),
});

export const CreateProductSchema = z.object({
	name: z.string().min(1, { message: 'Tên sản phẩm không được để trống' }),
	description: z.string().optional(),
	price: z.string().min(1, { message: 'Giá sản phẩm không được để trống' }),
	manufacturer: z.string().optional(),
	categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục sản phẩm' }),
	images: z.array(z.instanceof(File)).optional(),
	detail: ProductDetailSchema,
});

// Requests
export type CreateProductRequest = FormData;

// Responses
export type CreateProductResponse = {
	id: number;
	categoryId: number;
	name: string;
	description: string | null;
	price: string;
	manufacturer: string | null;
	createdAt: string;
	updatedAt: string;
	category: CategoryResponse;
	images: Image[];
	detail: ProductDetail;
};

// Models
export type Image = {
	id: number;
	imageUrl: string;
};

export type ProductDetail = {
	id: number;
	productId: number;
	composition: string | null;
	usageText: string | null;
	dosage: string | null;
	targetUser: string | null;
	warning: string | null;
};
