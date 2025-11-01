import { NextResponse } from "next/server"
import * as jose from "jose"

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/login", "/api/register"]
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "your-secret-key-change-in-production")

export default async function middleware(request: any) {
    const pathname = request.nextUrl.pathname;
    console.log(pathname)

    // Allow public paths
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next()
    }

    // Check for session token
    const token = request.cookies.get("session")?.value

    // Protect routes - redirect to login if no valid token
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Verify token validity
    try {
        await jose.jwtVerify(token, SECRET)
        return NextResponse.next()
    } catch {
        // Token is invalid or expired - clear and redirect
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("session")
        return response
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
