import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken ( {
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!token;

    if(pathname === "/"){
        if(!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
        return NextResponse.redirect(new URL("/admin/employee", req.url));
    }
    if(pathname === "/login"){
        if(isLoggedIn) return NextResponse.redirect(new URL("/admin/employee", req.url));
        return NextResponse.next();
    }
    if(!isLoggedIn) 
        return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/admin/:path*", "/login"]
}