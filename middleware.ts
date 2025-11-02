import { NextResponse, type NextRequest } from "next/server"
import * as jose from "jose"

// Public paths that don't require authentication
const PUBLIC_PATHS = [
    "/",
    "/login",
    "/register",
    "/api/login",
    "/api/register",
]

// Protected routes that require authentication
const PROTECTED_ROUTES = [
    "/dashboard",
    "/mcq",
]

// Protected API routes
const PROTECTED_API_ROUTES = [
    "/api/generate-mcq",
    "/api/me",
    "/api/logout",
]

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "your-secret-key-change-in-production")

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Allow public paths
    if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/login") || pathname.startsWith("/api/register")) {
        return NextResponse.next()
    }

    // Check if the route is protected (dashboard, mcq, or protected API routes)
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))

    if (!isProtectedRoute && !isProtectedApiRoute) {
        // Allow access to other routes (like static files, etc.)
        return NextResponse.next()
    }

    // Check for session token
    const token = request.cookies.get("session")?.value

    // Protect routes - redirect to login if no valid token
    if (!token) {
        // For API routes, return 401 instead of redirecting
        if (isProtectedApiRoute) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }
        // For page routes, redirect to login
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Verify token validity
    try {
        await jose.jwtVerify(token, SECRET)
        return NextResponse.next()
    } catch {
        // Token is invalid or expired - clear and redirect
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
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
    ],
}

