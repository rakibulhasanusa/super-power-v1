import { users } from './db/schema';
import * as jose from "jose"
import bcryptjs from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "your-secret-key-change-in-production")

export async function hashPassword(password: string): Promise<string> {
    if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters")
    }
    return bcryptjs.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
    if (!userId) {
        throw new Error("User ID is required for session creation")
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const token = await new jose
        .SignJWT({ userId, sessionId: crypto.randomUUID() })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET)

    return token
}

export async function verifySession(token: string) {
    try {
        const verified = await jose.jwtVerify(token, SECRET)
        return verified.payload as { userId: string; sessionId: string }
    } catch (err) {
        console.error("[v0] Session verification failed:", err)
        return null
    }
}

export async function getCurrentUser(token: string | undefined) {
    if (!token) return null

    const payload = await verifySession(token)
    if (!payload) return null

    const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1).then(res => res[0])

    return user || null
}
