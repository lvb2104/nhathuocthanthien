// ============================================================================
// GET PRODUCTS
// ============================================================================
export type GetProductsResponse = Products;

// ============================================================================
// GET PRODUCT BY ID
// ============================================================================
export type GetProductByIdResponse = Product;

// ============================================================================
// CREATE PRODUCT
// ============================================================================
export type CreateProductRequest = FormData;

export type CreateProductResponse = Product;

// ============================================================================
// UPDATE PRODUCT
// ============================================================================
export type UpdateProductRequest = FormData;

export type UpdateProductResponse = Product;

// ============================================================================
// DELETE PRODUCT
// ============================================================================
export type DeleteProductResponse = {
	message: string;
};

// ============================================================================
// MODELS
// ============================================================================
export type ProductWithoutDetail = Omit<Product, 'detail'>;
export type Products = ProductWithoutDetail[];

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
	images: ImageDto[];
	detail: ProductDetail;
};

export type ImageDto = {
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

type Category = {
	id: number;
	name: string;
};
