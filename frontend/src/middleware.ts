import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken ( {
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if(req.nextUrl.pathname === "/"){
        if(!token) return NextResponse.redirect(new URL("/login", req.url))
        return NextResponse.redirect(new URL("/admin/employee", req.url))
    }
    if(!token) 
        return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/admin/employee", "/admin/employee/upset/:path*"]
}