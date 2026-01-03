import { z } from 'zod';

export const CreateBatchSchema = z.object({
	productId: z.string().min(1, 'Product is required'),
	batchCode: z.string().optional(),
	quantity: z.string().min(1, 'Quantity is required'),
	expiryDate: z.string().min(1, 'Expiry date is required'),
	receivedDate: z.string().optional(),
	note: z.string().optional(),
});

export const UpdateBatchSchema = z.object({
	batchCode: z.string().optional(),
	quantity: z.string().optional(),
	expiryDate: z.string().optional(),
	receivedDate: z.string().optional(),
	note: z.string().optional(),
});
