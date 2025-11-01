import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        console.log("[v0] Logout attempt")

        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 })

        response.cookies.set("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        })

        response.headers.set("Cache-Control", "no-store, must-revalidate")

        return response
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        console.error(" Logout error:", errorMessage)
        return NextResponse.json({ error: "Logout failed" }, { status: 500 })
    }
}
