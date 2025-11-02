import { NextResponse, type NextRequest } from "next/server"
import * as jose from "jose"

const PUBLIC_PATHS = ["/", "/login", "/register"]
const PROTECTED_ROUTES = ["/dashboard/:path*", "/mcq"]
const PROTECTED_API_ROUTES = ["/api/generate-mcq", "/api/me", "/api/logout"]

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || " ")

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    if (PUBLIC_PATHS.includes(pathname)) {
        console.log("Path is public, allowing access")
        return NextResponse.next()
    }

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))

    if (!isProtectedRoute) {
        return NextResponse.next()
    }

    // Get token from cookies
    const token = request.cookies.get("session")?.value

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
