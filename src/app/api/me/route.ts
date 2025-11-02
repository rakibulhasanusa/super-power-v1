import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { users } from "@/lib/db/schema"

export const maxDuration = 10

export async function GET(request: NextRequest) {
    try {
        let token = request.headers.get("Authorization")?.slice(7) // Bearer token

        if (!token) {
            token = request.cookies.get("session")?.value
        }

        if (!token) {
            return NextResponse.json({ error: "No session or authorization header provided" }, { status: 401 })
        }

        const payload = await verifySession(token)
        if (!payload) {
            return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
        }

        const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1).then((res) => res[0])

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const response = NextResponse.json(
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    academicQualification: user.academicQualification,
                    createdAt: user.createdAt,
                },
            },
            { status: 200 },
        )

        response.headers.set("Cache-Control", "private, no-store")
        response.headers.set("X-Token-Valid", "true")

        return response
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }
}