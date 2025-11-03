import { users } from '../../../lib/db/schema';
import { type NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"

export const maxDuration = 30

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, academicQualification } = body

        if (!name?.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }

        if (!email?.trim()) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        if (!password || password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1).then(res => res[0])

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
        }

        const hashedPassword = await hashPassword(password)
        const userId = crypto.randomUUID()

        const [newUser] = await db
            .insert(users)
            .values({
                id: userId,
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
                academicQualification: academicQualification?.trim() || null,
            })
            .returning()

        const sessionToken = await createSession(userId)

        const response = NextResponse.json(
            {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
                message: "User created successfully",
            },
            { status: 201 },
        )

        response.cookies.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
    }
}
