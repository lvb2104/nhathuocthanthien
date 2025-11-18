import EditProductForm from '@/components/forms/edit-product-form';
import React from 'react';

async function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <EditProductForm id={Number(id)} />;
}

export default EditProductPage;
