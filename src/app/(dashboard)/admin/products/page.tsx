import { DataTable } from '@/components/data-table';
import React from 'react';
import data from '../data.json';

function ProductsPage() {
	return <DataTable data={data} />;
}

export default ProductsPage;
