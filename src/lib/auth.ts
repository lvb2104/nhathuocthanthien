import { app } from '@/configs/app';
import { getDecodedPayloadFromJwt } from '@/lib/utils';
import { SignInRequest, UserRole } from '@/types';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { serverRefreshToken, serverSignIn } from '@/services';
import { routes } from '@/configs/routes';

export const credentialsProviderId = 'credentials';

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
	try {
		// Call backend API /auth/sign-in
		const response = await serverSignIn(credentials);
		const decoded = getDecodedPayloadFromJwt(response.accessToken);

		return {
			id: decoded.id,
			email: credentials.email,
			fullName: decoded.fullName,
			avatarUrl: decoded.avatarUrl,
			role: decoded.role,
			accessToken: response.accessToken,
			accessTokenExpires: decoded.exp * 1000,
		};
	} catch (error) {
		throw error;
	}
}

async function refreshAccessToken() {
	try {
		const response = await serverRefreshToken();

		const decoded = getDecodedPayloadFromJwt(response.accessToken);

		return {
			accessToken: response.accessToken,
			accessTokenExpires: decoded.exp * 1000,
			id: decoded.id,
			fullName: decoded.fullName,
			avatarUrl: decoded.avatarUrl,
			role: decoded.role,
		};
	} catch {
		return { error: 'RefreshAccessTokenError' };
	}
}

export const authOptions: NextAuthOptions = {
	session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
	pages: {
		signIn: routes.auth.signIn, // Set custom sign-in url in localstorage
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null;
				}

				return authenticateWithCredentials({
					email: credentials.email,
					password: credentials.password,
				});
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const signedInUser = user as AuthenticatedUser;
				return {
					...token,
					accessToken: signedInUser.accessToken,
					accessTokenExpires: signedInUser.accessTokenExpires,
					id: signedInUser.id,
					fullName: signedInUser.fullName,
					avatarUrl: signedInUser.avatarUrl,
					role: signedInUser.role,
					email: signedInUser.email,
				};
			}

			if (
				token.accessToken &&
				token.accessTokenExpires &&
				Date.now() < token.accessTokenExpires - app.REFRESH_THRESHOLD_MS
			) {
				return token;
			}

			if (!token.accessToken || !token.accessTokenExpires) {
				return token;
			}

			return refreshAccessToken();
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as number;
				session.user.fullName = token.fullName as string;
				session.user.avatarUrl = token.avatarUrl as string;
				session.user.role = token.role as UserRole;
				session.user.email = token.email as string;
			} else {
				session.user = {
					id: token.id as number,
					fullName: token.fullName as string,
					avatarUrl: token.avatarUrl as string,
					role: token.role as any,
					email: token.email as string,
				};
			}

			(session as any).accessToken = token.accessToken;
			(session as any).accessTokenExpires = token.accessTokenExpires;
			(session as any).error = token.error;
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET || 'default_secret',
};
