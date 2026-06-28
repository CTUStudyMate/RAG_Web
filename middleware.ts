import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    const isLoginPage = req.nextUrl.pathname === "/login";

    if (!token && !isLoginPage) {
        const loginUrl = new URL("/login", req.url);

        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|login|register).*)"],
};