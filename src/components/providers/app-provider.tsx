'use client';
import { queryClientConfig } from '@/configs/query-client-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { SocketInitializer } from '@/components/socket-initializer';

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(() => new QueryClient(queryClientConfig)); // not really sure 100% not re-render when using useMemo
	return (
		<SessionProvider
			refetchOnWindowFocus={false}
			refetchWhenOffline={false}
			refetchInterval={0}
		>
			<SocketInitializer />
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</SessionProvider>
	);
}
