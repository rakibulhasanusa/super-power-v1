import { users } from './db/schema';
import * as jose from "jose"
import bcryptjs from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "")

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

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
        if (!token || typeof token !== "string") {
            return null
        }

        const verified = await jose.jwtVerify(token, SECRET)
        const payload = verified.payload as { userId: string; sessionId: string }

        if (!payload.userId || !payload.sessionId) {
            return null
        }

        return payload
    } catch (err) {
        if (err instanceof jose.errors.JWTExpired) {
        } else if (err instanceof jose.errors.JWTInvalid) {
        } else {
        }
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
