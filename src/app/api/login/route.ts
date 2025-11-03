import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPassword, createSession } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { users } from "@/lib/db/schema"

export const maxDuration = 30

export async function POST(request: NextRequest) {
    try {
        let email: string
        let password: string

        try {
            const body = await request.json()
            email = body.email
            password = body.password
        } catch (err) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
        }

        // Validate inputs
        if (!email?.trim() || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        // Find user by email
        const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1).then(res => res[0]);

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const sessionToken = await createSession(user.id)

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

        response.cookies.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        })

        return response
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        // console.error(" Login error:", errorMessage)
        return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 })
    }
}
