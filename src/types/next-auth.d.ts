import type { DefaultSession } from 'next-auth';
import type { UserRole } from './auth';

declare module 'next-auth' {
	interface Session {
		user?: {
			id: number;
			fullName: string;
			avatarUrl: string;
			role: UserRole;
			email: string;
		} & DefaultSession['user'];
		accessToken?: string;
		accessTokenExpires?: number;
		error?: string;
	}

	interface User {
		id: number;
		fullName: string;
		avatarUrl: string;
		role: UserRole;
		email: string;
		accessToken?: string;
		accessTokenExpires?: number;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id?: number;
		fullName?: string;
		avatarUrl?: string;
		role?: UserRole;
		email?: string;
		accessToken?: string;
		accessTokenExpires?: number;
		error?: string;
	}
}
