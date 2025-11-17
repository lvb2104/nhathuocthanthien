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

export const UpdateProductSchema = CreateProductSchema;

export const CategorySchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const ImageSchema = z.object({
	id: z.number(),
	imageUrl: z.string(),
});

export const ProductSchema = z.object({
	id: z.number(),
	categoryId: z.number(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.string(),
	manufacturer: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	category: CategorySchema,
	images: z.array(ImageSchema).optional().default([]),
});

// Requests
export type CreateProductRequest = FormData;
export type UpdateProductRequest = FormData;

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
	images: ImageSchema[];
	detail: ProductDetail;
};

export type UpdateProductResponse = CreateProductResponse;

export type ProductsResponse = z.infer<(typeof ProductSchema)[]>;
export type ProductResponse = z.infer<typeof ProductSchema>;

export type ProductByIdResponse = CreateProductResponse;

// Models
export type ImageSchema = {
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
