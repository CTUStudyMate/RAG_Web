import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_CLAIM =
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

function getRoleFromToken(token: string): string | null {
    try {
        const payload = token.split(".")[1];

        if (!payload) {
            return null;
        }

        const normalizedPayload = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const decodedPayload = JSON.parse(
            atob(normalizedPayload)
        ) as Record<string, unknown>;

        const role = decodedPayload[ROLE_CLAIM] ?? decodedPayload.role;

        return typeof role === "string" ? role : null;
    } catch {
        return null;
    }
}

export function proxy(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;

    const pathname = req.nextUrl.pathname;
    const isLoginPage = pathname === "/login";
    const isHomePage = pathname === "/";
    const isPendingApprovalPage = pathname.startsWith("/pending-approval");

    if (!token && !isLoginPage) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);

        return NextResponse.redirect(loginUrl);
    }

    if (token && isHomePage) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (token && isPendingApprovalPage) {
        const role = getRoleFromToken(token);
        if (role?.toLowerCase() !== "lecturer") {
            console.log("user is not lecturer")
            console.log(role)
            return NextResponse.redirect(new URL("/home", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|login|register).*)"],
};