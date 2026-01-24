// ============================================================================
// GET OVERVIEW STATISTICS
// ============================================================================
export type OverviewStatistics = {
	totalOrders: number;
	totalRevenue: number;
	totalUsers: number;
	totalProducts: number;
};

export type GetOverviewStatisticsResponse = {
	data: OverviewStatistics;
};

// ============================================================================
// GET REVENUE STATISTICS
// ============================================================================
export type RevenueDataPoint = {
	date: string;
	totalRevenue: number;
	orderCount: number;
};

export type RevenueStatisticsParams = {
	startDate?: string; // YYYY-MM-DD format
	endDate?: string; // YYYY-MM-DD format
};

export type GetRevenueStatisticsResponse = {
	data: RevenueDataPoint[];
};

// ============================================================================
// GET TOP SELLING PRODUCTS
// ============================================================================
export type TopProductData = {
	productId: number;
	totalSold: number;
	totalRevenue: number;
	product: {
		id: number;
		name: string;
		price: number;
	};
};

export type TopSellingProductsParams = {
	limit?: number;
};

export type GetTopSellingProductsResponse = {
	data: TopProductData[];
};

// ============================================================================
// GET INVENTORY STATISTICS
// ============================================================================
export type LowStockProduct = {
	productId: number;
	totalQuantity: number;
	product: {
		id: number;
		name: string;
	};
};

export type NearExpiryBatch = {
	id: number;
	productId: number;
	quantity: number;
	expiryDate: string;
	product: {
		id: number;
		name: string;
	};
};

export type InventoryStatisticsData = {
	lowStockProducts: LowStockProduct[];
	nearExpiryBatches: NearExpiryBatch[];
};

export type GetInventoryStatisticsResponse = {
	data: InventoryStatisticsData;
};

// ============================================================================
// EXPORT REVENUE REPORT
// ============================================================================
export type ExportRevenueParams = {
	format?: 'excel' | 'pdf';
	startDate?: string;
	endDate?: string;
};

// ============================================================================
// EXPORT PRODUCTS REPORT
// ============================================================================
export type ExportProductsParams = {
	format?: 'excel' | 'pdf';
	limit?: number;
};

// ============================================================================
// EXPORT INVENTORY REPORT
// ============================================================================
export type ExportInventoryParams = {
	format?: 'excel' | 'pdf';
};
