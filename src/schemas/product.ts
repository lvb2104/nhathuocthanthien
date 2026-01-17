import z from 'zod';

const CategorySchema = z.object({
	id: z.number(),
	name: z.string(),
});

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
