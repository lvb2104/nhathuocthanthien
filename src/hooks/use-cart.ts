import { useQuery } from '@tanstack/react-query';
import { getCart } from '@/services/cart';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/types';

/**
 * Hook to fetch the user's cart from the backend
 * Only fetches when user is authenticated
 */
export function useCart() {
	const { data: session } = useSession();
	const isCustomer = session?.user?.role === UserRole.CUSTOMER;

	return useQuery({
		queryKey: ['cart'],
		queryFn: getCart,
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: !!session?.user && isCustomer, // Only fetch for authenticated customers
	});
}
