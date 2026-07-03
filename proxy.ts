import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;

    const isLoginPage = req.nextUrl.pathname === "/login";

    if (!token && !isLoginPage) {
        const loginUrl = new URL("/login", req.url);

        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);

        return NextResponse.redirect(loginUrl);
    }
    const isHomePage = req.nextUrl.pathname === "/";
    if (token && isHomePage) {
        const chatUrl = new URL("/chat", req.url);
        return NextResponse.redirect(chatUrl);
    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|login|register).*)"],
};