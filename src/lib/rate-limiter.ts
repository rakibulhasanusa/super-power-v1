import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.KV_MAIN_REST_API_URL!,
    token: process.env.KV_MAIN_REST_API_TOKEN!,
})

export async function checkRateLimit(ip: string): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
    totalHits: number
}> {
    const key = `rate_limit:${ip}`
    const windowMs = 24 * 60 * 60 * 1000 // 24 hour window
    const maxRequests = 4 // 4 requests per 24 hours

    // Get current count
    const current = (await redis.get<number>(key)) || 0

    if (current >= maxRequests) {
        const ttl = await redis.ttl(key)
        return {
            allowed: false,
            remaining: 0,
            resetTime: Date.now() + ttl * 1000,
            totalHits: current,
        }
    }

    // Increment counter and set expiration
    const newCount = await redis.incr(key)
    if (newCount === 1) {
        await redis.expire(key, Math.floor(windowMs / 1000))
    }

    const ttl = await redis.ttl(key)

    return {
        allowed: true,
        remaining: maxRequests - newCount,
        resetTime: Date.now() + ttl * 1000,
        totalHits: newCount,
    }
}

export function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")

    console.log({ request });

    if (forwarded) {
        return forwarded.split(",")[0].trim()
    }

    return realIP || "127.0.0.1"
}

export function logRateLimit(ip: string, allowed: boolean, remaining: number): void {
    const status = allowed ? "ALLOWED" : "BLOCKED"
    console.log(`[RATE_LIMIT_${status}] IP: ${ip}, Remaining: ${remaining}`)
}