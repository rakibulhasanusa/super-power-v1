import { NextResponse, type NextRequest } from "next/server"
import * as jose from "jose"

const PUBLIC_PATHS = ["/", "/login", "/register"]
const PROTECTED_AUTH_PATHS = ["/login", "/register"]
const PROTECTED_ROUTES = ["/dashboard", "/mcq"]
const PROTECTED_API_ROUTES = ["/api/generate-mcq", "/api/me", "/api/logout"]

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "djdjfkdjkieisljlksjoiedkjsljoiwoe")

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Get token from cookies
    const token = request.cookies.get("session")?.value

    // Verify token if it exists
    let isAuthenticated = false
    if (token) {
        try {
            await jose.jwtVerify(token, SECRET)
            isAuthenticated = true
        } catch (error) {
            isAuthenticated = false
        }
    }

    // If authenticated and trying to access login/register, redirect to dashboard
    if (isAuthenticated && PROTECTED_AUTH_PATHS.includes(pathname)) {
        console.log("Authenticated user trying to access auth page, redirecting to dashboard")
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If path is public and not an auth path, allow access
    if (PUBLIC_PATHS.includes(pathname) && !PROTECTED_AUTH_PATHS.includes(pathname)) {
        console.log("Path is public, allowing access")
        return NextResponse.next()
    }

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))

    // If not a protected route, allow access
    if (!isProtectedRoute && !isProtectedApiRoute) {
        return NextResponse.next()
    }

    // Protected route - check authentication
    if (!isAuthenticated) {
        if (isProtectedApiRoute) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("session")
        return response
    }

    // Authenticated and accessing protected route
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}