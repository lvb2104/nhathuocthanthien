import z from 'zod';
import { Category } from '.';

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
	images: z.array(
		z.object({
			id: z.number(),
			imageUrl: z.string(),
		}),
	),
	detail: z.object({
		id: z.number(),
		productId: z.number(),
		composition: z.string().nullable(),
		usageText: z.string().nullable(),
		dosage: z.string().nullable(),
		targetUser: z.string().nullable(),
		warning: z.string().nullable(),
	}),
});

// Requests
export type CreateProductRequest = FormData;
export type UpdateProductRequest = FormData;

// Responses
export type CreateProductResponse = Product;

export type UpdateProductResponse = Product;

export type GetProductsResponse = Product[];

export type GetProductByIdResponse = Product;

export type DeleteProductResponse = {
	message: string;
};

// Models
export type Product = {
	id: number;
	categoryId: number;
	name: string;
	description: string | null;
	price: string;
	manufacturer: string | null;
	createdAt: string;
	updatedAt: string;
	category: Category;
	images: Image[];
	detail: ProductDetail;
};

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
