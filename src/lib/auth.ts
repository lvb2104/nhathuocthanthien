import { app } from '@/configs/app';
import { getDecodedPayloadFromJwt } from '@/lib/utils';
import { SignInRequest, UserRole } from '@/types';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { serverRefreshToken, serverSignIn } from '@/services';
import { routes } from '@/configs/routes';
import { cookies } from 'next/headers';

type AuthenticatedUser = {
	id: number;
	email: string;
	fullName: string;
	avatarUrl: string;
	role: UserRole;
	accessToken: string;
	accessTokenExpires: number;
};

async function authenticateWithCredentials(
	credentials: SignInRequest,
): Promise<AuthenticatedUser> {
	const response = await serverSignIn(credentials);
	const decoded = getDecodedPayloadFromJwt(response.accessToken);

	if (!decoded) {
		throw new Error('Token không hợp lệ. Vui lòng thử lại.');
	}

	return {
		id: decoded.id,
		email: credentials.email,
		fullName: decoded.fullName,
		avatarUrl: decoded.avatarUrl,
		role: decoded.role,
		accessToken: response.accessToken,
		accessTokenExpires: decoded.exp * 1000,
	};
}

async function getIncomingCookieHeader(): Promise<string | undefined> {
	try {
		const store = await cookies();
		const all = store.getAll();
		if (!all.length) return undefined;
		return all
			.map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
			.join('; ');
	} catch {
		return undefined;
	}
}

async function refreshAccessToken(token?: any) {
	try {
		const cookieHeader = await getIncomingCookieHeader();
		// we don't need to call from client to nextjs server proxy to refresh access token because what we all need is the new access token, not set refresh token again
		const response = await serverRefreshToken(cookieHeader);

		const decoded = getDecodedPayloadFromJwt(response.accessToken);

		if (!decoded) {
			throw new Error('Token không hợp lệ. Vui lòng thử lại.');
		}

		return {
			...(token || {}),
			accessToken: response.accessToken,
			accessTokenExpires: decoded.exp * 1000,
			id: decoded.id,
			fullName: decoded.fullName,
			avatarUrl: decoded.avatarUrl,
			role: decoded.role,
		};
	} catch {
		return { ...(token || {}), error: 'RefreshAccessTokenError' };
	}
}

export const authOptions: NextAuthOptions = {
	// use jwt strategy to store the session in cookies with the name "next-auth.session-token"
	// sending the cookie to the server on every request to verify the session
	// then it is "token" parameter in jwt() callback
	session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
	pages: {
		signIn: routes.auth.signIn,
	},
	providers: [
		CredentialsProvider({
			id: app.CREDENTIALS_PROVIDER_ID,
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			// starting point: log in with credentials including email and password, and then create a new simple token with the user object
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null;
				}

				try {
					const user = await authenticateWithCredentials({
						email: credentials.email,
						password: credentials.password,
					});
					return user;
				} catch {
					return null;
				}
			},
		}),
	],
	callbacks: {
		// jwt() is called when calling getToken() or useSession() hook
		// user is the user object returned from the authorize() callback (the first time user logs in)
		async jwt({ token, user }) {
			// if user is provided, return a new token with the user object
			if (user) {
				return {
					...token, // keep the previous token created by the authorize() callback
					...user, // add the user object to the token
				};
			}

			const isTokenValid =
				token.accessToken &&
				token.accessTokenExpires &&
				Date.now() < token.accessTokenExpires - app.REFRESH_THRESHOLD_MS;

			if (isTokenValid) {
				return token;
			}

			return refreshAccessToken(token);
		},
		// session() is called when calling getSession() or useSession() hook
		// session is the session object stored in cookies with the name "next-auth.session-token"
		async session({ session, token }) {
			// if user is exists, update the user with the token object
			if (session.user) {
				session.user.id = token.id as number;
				session.user.fullName = token.fullName as string;
				session.user.avatarUrl = token.avatarUrl as string;
				session.user.role = token.role as UserRole;
				session.user.email = token.email as string;
			} else {
				// if user is not exists, create a new user with the token object
				session.user = {
					id: token.id as number,
					fullName: token.fullName as string,
					avatarUrl: token.avatarUrl as string,
					role: token.role as any,
					email: token.email as string,
				};
			}

			session.accessToken = token.accessToken;
			session.accessTokenExpires = token.accessTokenExpires;
			session.error = token.error;
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET || 'default_secret',
};
