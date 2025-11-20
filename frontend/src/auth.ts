import { login } from "@/service/auth.service";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from "uuid";

interface JwtPayload {
    exp: number,
    [key: string]: any
}

const options = (isRefreshToken: boolean = true) => {
    return {
        grant_type: isRefreshToken ? "refresh_token" : "password",
        client_id: "EmployeeQualificationManagement_App",
        scope: "EmployeeQualificationManagement offline_access"
    }
}

async function refreshToken(token?: { refresh_token: string }) {
    try {
        const refreshT = token?.refresh_token || "";
        const res = await login({
            ...options(),
            refresh_token: refreshT
        });
        if (res.status === 200) {
            const data = await res.data as { access_token: string, refresh_token: string };
            return {
                ...token,
                refreshToken: data.access_token,
                accessToken: data.refresh_token
            }
        }
    } catch (e) {
        return {
            ...token
        }
    }

}

export const {
    handlers: { GET, POST },
    auth
} = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "text" }
            },
            async authorize(credentials) {
                try {
                    const res = await login({
                        ...options(false),
                        username: typeof credentials?.username === "string" ? credentials.username : undefined,
                        password: typeof credentials?.password === "string" ? credentials.password : undefined
                    })
                    if (res.status === 200) {
                        const result = res.data as { access_token: string, refresh_token: string };
                        return {
                            id: uuidv4(),
                            accessToken: result.access_token,
                            refreshToken: result.refresh_token
                        };
                    }
                    return null;
                } catch (err) {
                    return null;
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user, account }: { token: any; user?: any, account?: any }) {
            if (user && account) {
                // merge user into token
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                }
            }

            if (token.accessToken) {
                const decodedToken: JwtPayload = jwtDecode(token.accessToken);
                token.accessTokenExpires = decodedToken.exp * 1000;

                if (Date.now() < token.accessTokenExpires) {
                    return token;
                }
                return refreshToken(token);
            }

            return token;

        },

        async session({ session, token }: { session: any; token: any }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            try {
                const decoded: any = jwtDecode(token.accessToken);
                session.user = {
                    ...session.user,
                    role: decoded?.role || decoded?.scope || "EMPLOYEE" 
                }
            } catch {
                 session.user = {
                    ...session.user,
                    role: "EMPLOYEE" 
                }
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/error"
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60 // 1 day
    },
    secret: process.env.NEXTAUTH_SECRET!
});

