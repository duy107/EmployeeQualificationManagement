import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { getPermissionToPathMap } from "./lib/permission";

export async function middleware(req: NextRequest) {

    const session = await auth();

    const isLoggedIn = !!session;
    const roleName = isLoggedIn && session?.user?.role;

    const { pathname } = req.nextUrl;

    if (pathname === "/") {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
        return NextResponse.redirect(new URL("/admin/employee", req.url));
    }

    if (pathname === "/login") {
        if (isLoggedIn) return NextResponse.redirect(new URL("/admin/employee", req.url));
        return NextResponse.next();
    }

    if (!isLoggedIn)
        return NextResponse.redirect(new URL("/login", req.url));

    const rolePermissonMap = await getPermissionToPathMap();

    const isAllowed = rolePermissonMap.find(item => item.role === roleName)?.permissions
        .some(allowedPath => pathname.startsWith(allowedPath));

    if (!isAllowed && roleName != "admin") {
        return NextResponse.redirect(new URL("/admin/employee", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/admin/:path*", "/login"]
}