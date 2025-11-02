import { NextResponse, type NextRequest } from "next/server"
import * as jose from "jose"

const PUBLIC_PATHS = ["/", "/login", "/register"]
const PROTECTED_ROUTES = ["/dashboard/:path*", "/mcq"]
const PROTECTED_API_ROUTES = ["/api/:path*"]

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "your-secret-key-change-in-production")

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log("Proxy check for path:", pathname)

    // Allow public paths and skip API auth endpoints
    if (PUBLIC_PATHS.includes(pathname)) {
        console.log("Path is public, allowing access")
        return NextResponse.next()
    }

    // Check if the route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))

    if (!isProtectedRoute) {
        return NextResponse.next()
    }

    // Get token from cookies
    const token = request.cookies.get("session")?.value
    console.log("[v0] Checking token for protected route:", pathname, "Token exists:", !!token)

    if (!token) {
        if (isProtectedApiRoute) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Verify token
    try {
        await jose.jwtVerify(token, SECRET)
        console.log("Token verified successfully")
        return NextResponse.next()
    } catch (error) {
        console.log("Token verification failed:", error)
        const response = isProtectedApiRoute
            ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            : NextResponse.redirect(new URL("/login", request.url))

        if (!isProtectedApiRoute) {
            response.cookies.delete("session")
        }
        return response
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
