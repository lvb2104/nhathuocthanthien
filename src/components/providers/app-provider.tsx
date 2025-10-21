'use client';
import { queryClientConfig } from '@/configs/query-client-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(() => new QueryClient(queryClientConfig));
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
